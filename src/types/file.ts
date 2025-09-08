export interface IFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string;
  modified_on: string;
  charset: null;
  filesize: string;
  width: number;
  height: number;
  duration: null;
  embed: null;
  description: null;
  location: null;
  tags: null;
  metadata: object;
  focal_point_x: null;
  focal_point_y: null;
}
