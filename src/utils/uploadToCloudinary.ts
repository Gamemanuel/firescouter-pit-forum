import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '@/secrets';

export const uploadToCloudinary = async (
  dataUrl: string
) => {
  const fd = new FormData();
  fd.append('file', dataUrl);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });

  const json = await res.json();
  if (!json.secure_url) throw new Error("Upload failed");
  return json;
};