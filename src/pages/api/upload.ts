import { v2 as cloudinary } from "cloudinary";


export default async function handler(req, res) {
  const CLOUDINARY_API_SECRET = "myKey";
  const body = JSON.parse(req.body) || {};
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      "DHrUIK0CzmIVHEwnr6oGIvxZo8U"
    );
    res.status(200).json({
      signature,
    });
  } catch (error) {
    res.status(500).json({
      error: e.message,
    });
  }
}