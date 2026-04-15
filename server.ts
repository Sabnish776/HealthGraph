import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { db } from './src/db/index';
import { hospitals, patients, visits, medications, reports, diseases, otps } from './src/db/schema';
import { eq, and, or, desc, count } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // File Upload Configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.post('/api/upload', authenticateToken, upload.single('file'), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  });

  // Hospital Auth
  app.post('/api/hospital/register', async (req, res) => {
    const { name, password, address } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newHospital] = await db.insert(hospitals).values({
        name,
        password: hashedPassword,
        address,
      }).returning();
      res.json({ success: true, hospital: { id: newHospital.id, name: newHospital.name } });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/hospital/login', async (req, res) => {
    const { name, password } = req.body;
    try {
      const [hospital] = await db.select().from(hospitals).where(eq(hospitals.name, name));
      if (!hospital || !(await bcrypt.compare(password, hospital.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: hospital.id, type: 'hospital' }, JWT_SECRET);
      res.json({ token, hospital: { id: hospital.id, name: hospital.name } });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Patient Auth (OTP)
  app.post('/api/patient/otp/send', async (req, res) => {
    const { mobile } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    try {
      await db.insert(otps).values({ mobile, code, expiresAt });
      console.log(`[OTP for ${mobile}]: ${code}`); // Console-based OTP
      res.json({ success: true, message: 'OTP sent to console' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  });

  app.post('/api/patient/otp/verify', async (req, res) => {
    const { mobile, code } = req.body;
    try {
      const [otpRecord] = await db.select().from(otps)
        .where(and(eq(otps.mobile, mobile), eq(otps.code, code)))
        .orderBy(desc(otps.expiresAt))
        .limit(1);

      if (!otpRecord || otpRecord.expiresAt < new Date()) {
        return res.status(401).json({ error: 'Invalid or expired OTP' });
      }

      let [patient] = await db.select().from(patients).where(eq(patients.mobile, mobile));
      
      if (!patient) {
        // First time login - need registration info
        return res.json({ needsRegistration: true });
      }

      const token = jwt.sign({ id: patient.id, type: 'patient' }, JWT_SECRET);
      res.json({ token, patient });
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  app.post('/api/patient/register', async (req, res) => {
    const { mobile, name, gender, bloodGroup, age, emergencyContact } = req.body;
    try {
      const [newPatient] = await db.insert(patients).values({
        mobile, name, gender, bloodGroup, age, emergencyContact
      }).returning();
      const token = jwt.sign({ id: newPatient.id, type: 'patient' }, JWT_SECRET);
      res.json({ token, patient: newPatient });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Patient Data
  app.get('/api/patient/profile', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'patient') return res.sendStatus(403);
    try {
      const [patient] = await db.select().from(patients).where(eq(patients.id, req.user.id));
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.put('/api/patient/profile', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'patient') return res.sendStatus(403);
    try {
      const [updated] = await db.update(patients)
        .set(req.body)
        .where(eq(patients.id, req.user.id))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.get('/api/patient/history', authenticateToken, async (req: any, res) => {
    const patientId = req.user.type === 'patient' ? req.user.id : req.query.patientId;
    if (!patientId) return res.status(400).json({ error: 'Patient ID required' });

    try {
      const patientVisits = await db.select({
        visit: visits,
        hospitalName: hospitals.name
      })
      .from(visits)
      .leftJoin(hospitals, eq(visits.hospitalId, hospitals.id))
      .where(eq(visits.patientId, patientId))
      .orderBy(desc(visits.date));

      const patientMedications = await db.select().from(medications).where(eq(medications.patientId, patientId)).orderBy(desc(medications.startDate));
      const patientReports = await db.select().from(reports).where(eq(reports.patientId, patientId)).orderBy(desc(reports.date));
      const patientDiseases = await db.select().from(diseases).where(eq(diseases.patientId, patientId)).orderBy(desc(diseases.createdAt));

      res.json({
        visits: patientVisits,
        medications: patientMedications,
        reports: patientReports,
        diseases: patientDiseases
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  });

  // Hospital Actions
  app.get('/api/hospital/dashboard-stats', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'hospital') return res.sendStatus(403);
    try {
      const hospitalId = req.user.id;

      // Total Consultations (Global)
      const [visitsCount] = await db.select({ value: count() }).from(visits);

      // Reports Uploaded (Global)
      const [reportsCount] = await db.select({ value: count() }).from(reports);

      // Logged Patients (Global - total registered patients)
      const [patientsCount] = await db.select({ value: count() }).from(patients);

      // Recent Activity (Keep hospital-specific for privacy/relevance)
      const recentActivity = await db.select({
        id: visits.id,
        date: visits.date,
        reason: visits.reason,
        patientName: patients.name,
        patientMobile: patients.mobile,
        patientId: patients.id
      })
      .from(visits)
      .innerJoin(patients, eq(visits.patientId, patients.id))
      .where(eq(visits.hospitalId, hospitalId))
      .orderBy(desc(visits.date))
      .limit(10);

      res.json({
        totalConsultations: visitsCount.value,
        reportsUploaded: reportsCount.value,
        loggedPatients: patientsCount.value,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.get('/api/hospital/search-patient', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'hospital') return res.sendStatus(403);
    const { mobile } = req.query;
    try {
      const [patient] = await db.select().from(patients).where(eq(patients.mobile, mobile));
      if (!patient) return res.status(404).json({ error: 'Patient not found' });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  });

  app.post('/api/hospital/add-visit', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'hospital') return res.sendStatus(403);
    const { patientId, reason, diagnosis, notes, medications: meds, diseases: newDiseases, reports: visitReports } = req.body;
    
    console.log('--- ADD VISIT START ---');
    console.log('Patient ID:', patientId);
    console.log('Hospital ID:', req.user.id);

    try {
      await db.transaction(async (tx) => {
        const [visit] = await tx.insert(visits).values({
          patientId,
          hospitalId: req.user.id,
          reason,
          diagnosis,
          notes
        }).returning();

        console.log('Created visit with ID:', visit.id);

        if (meds && meds.length > 0) {
          console.log('Inserting medications:', meds.length);
          const medsToInsert = meds.map((m: any) => ({
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            patientId,
            visitId: visit.id,
            status: 'active'
          }));
          console.log('Meds data:', JSON.stringify(medsToInsert));
          await tx.insert(medications).values(medsToInsert);
        }

        if (newDiseases && newDiseases.length > 0) {
          console.log('Inserting diseases:', newDiseases.length);
          const diseasesToInsert = newDiseases.map((d: any) => ({
            name: d.name,
            status: d.status,
            patientId,
            diagnosedAtVisitId: visit.id
          }));
          console.log('Diseases data:', JSON.stringify(diseasesToInsert));
          await tx.insert(diseases).values(diseasesToInsert);
        }

        if (visitReports && visitReports.length > 0) {
          console.log('Inserting reports:', visitReports.length);
          const reportsToInsert = visitReports.map((r: any) => ({
            title: r.title,
            fileUrl: r.fileUrl,
            patientId,
            visitId: visit.id
          }));
          console.log('Reports data:', JSON.stringify(reportsToInsert));
          await tx.insert(reports).values(reportsToInsert);
        }
      });

      console.log('--- ADD VISIT SUCCESS ---');
      res.json({ success: true });
    } catch (error) {
      console.error('--- ADD VISIT FAILED ---');
      console.error(error);
      res.status(500).json({ error: 'Failed to add visit' });
    }
  });

  app.post('/api/hospital/add-report', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'hospital') return res.sendStatus(403);
    const { patientId, visitId, title, fileUrl, contentSummary } = req.body;
    try {
      const [report] = await db.insert(reports).values({
        patientId, visitId, title, fileUrl, contentSummary
      }).returning();
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add report' });
    }
  });

  app.put('/api/hospital/update-medication', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'hospital') return res.sendStatus(403);
    const { medicationId, status, endDate } = req.body;
    try {
      const [updated] = await db.update(medications)
        .set({ status, endDate: endDate ? new Date(endDate) : null })
        .where(eq(medications.id, medicationId))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update medication' });
    }
  });

  app.put('/api/hospital/update-disease', authenticateToken, async (req: any, res) => {
    if (req.user.type !== 'hospital') return res.sendStatus(403);
    const { diseaseId, status } = req.body;
    try {
      const [updated] = await db.update(diseases)
        .set({ status })
        .where(eq(diseases.id, diseaseId))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update disease' });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
