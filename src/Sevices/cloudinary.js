require("dotenv").config();
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(image) {
  const frontImage = image;
  const uploadResponse = await cloudinary.uploader.upload(frontImage);
  const result = {
    frontImageURL: uploadResponse.url,
    frontImageID: uploadResponse.public_id,
  };
  return result;
}

module.exports = { uploadImage: uploadImage };
