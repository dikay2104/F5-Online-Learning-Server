const path = require('path');
const fs = require('fs');
const { Innertube } = require('youtubei.js');
const { google } = require('googleapis');

const KEY_FILE_PATH = path.join(__dirname, '../config/apikeys.json');
const credentials = JSON.parse(fs.readFileSync(KEY_FILE_PATH, 'utf8'));

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// ─────────────────────────────────────────────
// Utility function: check video source
// ─────────────────────────────────────────────

const getVideoId = (url) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const isGoogleDriveLink = (url) => {
  return /drive\.google\.com\/file\/d\//.test(url);
};

const getDriveFileId = (url) => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? match[1] : null;
};

// ─────────────────────────────────────────────
// Google Drive Authorization via apikeys.json
// ─────────────────────────────────────────────

async function authorizeDrive() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
  });
  return await auth.getClient();
}

// ─────────────────────────────────────────────
// Get video duration from Google Drive
// ─────────────────────────────────────────────

async function getDriveVideoDuration(fileId) {
  const auth = await authorizeDrive();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.get({
    fileId,
    fields: 'videoMediaMetadata',
    supportsAllDrives: true,
  });

  const metadata = res.data.videoMediaMetadata;
  if (metadata && metadata.durationMillis) {
    return Math.floor(metadata.durationMillis / 1000); // seconds
  }

  return null;
}

// ─────────────────────────────────────────────
// Main: Get video duration from any URL
// ─────────────────────────────────────────────

async function getVideoDurationFromUrl(url) {
  if (isGoogleDriveLink(url)) {
    const fileId = getDriveFileId(url);
    if (fileId) {
      try {
        return await getDriveVideoDuration(fileId);
      } catch (err) {
        console.warn('❌ Lỗi lấy thời lượng Google Drive:', err.message);
        return null;
      }
    }
  }

  const videoId = getVideoId(url);
  if (videoId) {
    try {
      const youtube = await Innertube.create();
      const info = await youtube.getInfo(videoId);
      return info.basic_info.duration; // seconds
    } catch (err) {
      console.warn('❌ Lỗi lấy thời lượng YouTube:', err.message);
      return null;
    }
  }

  return null;
}

// ─────────────────────────────────────────────

module.exports = {
  getVideoId,
  isGoogleDriveLink,
  getDriveFileId,
  getVideoDurationFromUrl,
};
