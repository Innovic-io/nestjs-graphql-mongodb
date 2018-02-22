export interface FileInterface {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface ImageInterface {
  filename: string;
  contentType: string;
  encoding: string;
  Buffer: string;
}
