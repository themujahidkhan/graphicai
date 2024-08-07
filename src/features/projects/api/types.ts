export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  json: string;
  thumbnailUrl: string | null;
  templateThumbnailUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}