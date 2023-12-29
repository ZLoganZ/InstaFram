import { sha1 } from "crypto-hash";

export const uploadImage = async (file: File, folder = "") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_PRESET as string,
  );
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await res.json();
  return data.secure_url as string;
};

export const removeImage = async (imageURL?: string) => {
  if (!imageURL) return;

  const nameSplit = imageURL.split("/");
  const duplicateName = nameSplit.pop();

  // Remove .
  const public_id = duplicateName?.split(".").slice(0, -1).join(".");

  const formData = new FormData();
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY as string);
  formData.append("public_id", public_id!);
  const timestamp = String(Date.now());
  formData.append("timestamp", timestamp);
  const signature = await sha1(
    `public_id=${public_id}&timestamp=${timestamp}${
      import.meta.env.VITE_CLOUDINARY_API_SECRET
    }`,
  );
  formData.append("signature", signature);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.CLOUDINARY_CLOUD_NAME
    }/image/destroy`,
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await res.json();
  return {
    url: data as string,
    status: "done",
  };
};
