import { uploadFiles } from "@directus/sdk";
import directus from "./directus";
import { IFile } from "@/types/file";

export const uploadFilesToDirectus = async (files: File[]) => {
  try {
    const uploadedFiles: IFile[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadedFile = await directus.request<IFile>(uploadFiles(formData));
      uploadedFiles.push(uploadedFile);
    }
    return uploadedFiles;
  } catch (error) {
    console.error("Upload files error:", error);
    throw new Error("Failed to upload files");
  }
};
