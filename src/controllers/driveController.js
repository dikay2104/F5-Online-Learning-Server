// src/controllers/driveController.js
const { uploadVideoToDrive } = require('../services/googleDriveService');
const path = require('path');
const fs = require('fs');

const uploadDrive = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    const folderId = '1YYE2e2iPTZVg96q5b2mzy8cUF-z9Urfr'; // folder Google Drive của bạn

    const viewLink = await uploadVideoToDrive(filePath, file.originalname, folderId);

    fs.unlinkSync(filePath); // xóa file local sau khi upload

    res.json({ success: true, link: viewLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

module.exports = { uploadDrive };
