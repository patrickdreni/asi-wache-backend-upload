const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Set up upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload route
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei erhalten' });
  res.json({ success: true, filename: req.file.filename, path: '/uploads/' + req.file.filename });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.send('ASI-WACHE Upload API läuft!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
