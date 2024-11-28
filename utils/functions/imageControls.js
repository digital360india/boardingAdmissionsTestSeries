import CryptoJS from "crypto-js";
export const uploadImage = async (file, folderName ) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'abc_abchehe'); // Unsigned upload preset
  if (folderName) {
    formData.append('folder', folderName);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url; // Return the uploaded image's URL
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);
    throw error;
  }
};



export const deleteImage = async (publicId) => {
  console.log(publicId);
  const timestamp = Math.floor(Date.now() / 1000);
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error("Cloudinary API Secret is not defined.");
  }
  const signature = CryptoJS.HmacSHA1(
    `public_id=${publicId}&timestamp=${timestamp}`,
    apiSecret
  ).toString(CryptoJS.enc.Hex);
  console.log(signature);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    const data = await response.json();
    if (data.result === "ok") {
      console.log("Image deleted successfully");
    } else {
      throw new Error("Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting image:", error.message);
    throw error;
  }
};

