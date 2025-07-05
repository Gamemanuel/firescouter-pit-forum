import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '@/secrets';

export const uploadToCloudinary = async (
  file: Blob | File // Accepts Blob or File
) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });

  const json = await res.json();
  if (!json.secure_url) {
    console.error("Cloudinary upload response:", json);
    throw new Error(json.error?.message || "Upload failed: No secure_url in response");
  }
  return json;
};