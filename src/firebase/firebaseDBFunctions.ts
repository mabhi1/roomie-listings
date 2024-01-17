import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

async function uploadFile(fileName: string, file: File) {
  const storageRef = ref(storage, fileName);
  try {
    const uploadedFile = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    if (uploadedFile && url) return { url, uploadedFile };
    throw new Error("Error in uploading profile picture");
  } catch (error: any) {
    throw new Error("Error in uploading profile picture");
  }
}

async function deleteFile(fileName: string) {
  const storageRef = ref(storage, fileName);
  try {
    await deleteObject(storageRef);
  } catch (error: any) {
    throw new Error("Error in removing profile picture");
  }
}

export { uploadFile, deleteFile };
