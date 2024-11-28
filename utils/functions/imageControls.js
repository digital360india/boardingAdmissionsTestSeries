import s3 from '@/aws/aws-config';

export const uploadImage = async (file, folderName = '') => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: `${folderName}/${Date.now()}_${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; 
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};


export const deleteImage = async (fileName, folderName = '') => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: `${folderName}/${fileName}`, 
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`File deleted successfully from ${folderName}/${fileName}`);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Could not delete image. Please try again.");
  }
};