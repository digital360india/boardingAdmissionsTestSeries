import CryptoJS from "crypto-js";

export const uploadImage = async (file, folderName) => {
  if (!file) {
    console.error("File is undefined or invalid.");
    throw new Error("File input is required.");
  }
  
  console.log("Uploading file:", file);
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "p2pvclwt"); // Unsigned upload preset
  if (folderName) {
    formData.append("folder", "profile");
  }

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
    console.log(`Uploading to: ${uploadUrl}`);
  
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      const errorResponse = await response.text(); // Fetch the detailed error response
      console.error("Response Error:", errorResponse);
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
  
};

// export const deleteImage = async (publicId) => {
//   if (!publicId) {
//     throw new Error("Public ID is required to delete an image.");
//   }
//   const timestamp = Math.floor(Date.now() / 1000);
//   const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
//   const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
//   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
//   if (!apiSecret || !apiKey || !cloudName) {
//     throw new Error(
//       "Cloudinary API credentials are missing. Please check your environment variables."
//     );
//   }
//   const signatureString = `public_id=${publicId}&timestamp=${timestamp}`;
//   const signature = CryptoJS.HmacSHA1(signatureString, apiSecret).toString(
//     CryptoJS.enc.Hex
//   );
//   const formData = new FormData();
//   formData.append("public_id", publicId);
//   formData.append("timestamp", timestamp);
//   formData.append("signature", signature);
//   formData.append("api_key", apiKey);
  
//   try {
//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Error details:", errorData);
//       throw new Error("Failed to delete image from Cloudinary");
//     }

//     const data = await response.json();
//     console.log("Image deleted successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("Error deleting image:", error.message);
//     throw error;
//   }
// };


