const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select image",
      });
    }

    const base64 =
      `data:${req.file.mimetype};base64,` +
      req.file.buffer.toString("base64");

    const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder: "products",
        }
      );

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};