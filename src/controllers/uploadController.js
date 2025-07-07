const { cloudinary } = require('../services/cloudinaryService');

exports.uploadThumbnail = async (req, res) => {
    try {
        if( !req.file || !req.file.path) {
            return res.status(400).json({ mesage: "No file uploaded" });
        }

        return res.json({ url: req.file.path });
    } catch (err) {
        return res.status(500).json({ message: err.mesage });
    }
}