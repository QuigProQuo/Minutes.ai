const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const fs = require('fs');

router.post('/', async (req, res) => {
  const { title, content, transcription } = req.body;
  const fileContent = `Title: ${title}\n\nNotes:\n${content}\n\nTranscription:\n${transcription}`;

  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
      requestBody: {
        name: `${title}.txt`,
        mimeType: 'text/plain',
      },
      media: {
        mimeType: 'text/plain',
        body: fileContent,
      },
    });

    res.json({ fileId: response.data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload to Google Drive' });
  }
});

module.exports = router;
