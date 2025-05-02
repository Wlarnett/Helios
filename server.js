const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music-files', async (req, res) => {
  try {
    const musicDir = path.join(__dirname, 'public', 'Music');
    const files = await fs.readdir(musicDir);
    const audioFiles = files.filter(file => /\.(wav|mp3|flac)$/i.test(file));
    res.json(audioFiles);
  } catch (e) {
    console.error('Error reading music files:', e.message);
    res.status(500).json([]);
  }
});

app.get('/treatment-files', async (req, res) => {
  try {
    const treatmentDir = path.join(__dirname, 'public', 'Premade treatments');
    const files = await fs.readdir(treatmentDir);
    const audioFiles = files.filter(file => /\.(wav|mp3|flac)$/i.test(file));
    res.json(audioFiles);
  } catch (e) {
    console.error('Error reading treatment files:', e.message);
    res.status(500).json([]);
  }
});

app.post('/shutdown', (req, res) => {
  console.log('Received shutdown request');
  res.json({ message: 'Shutting down server' });
  setTimeout(() => {
    console.log('Closing server...');
    server.close(() => {
      console.log('Server closed');
      exec('taskkill /IM cmd.exe /F', (err) => {
        if (err) {
          console.error('Failed to close command prompt:', err.message);
        } else {
          console.log('Command prompt closed');
        }
      });
      process.exit(0);
    });
  }, 1000);
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});