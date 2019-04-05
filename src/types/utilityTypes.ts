export interface File extends Blob {
  prototype: File;
  readonly lastModified: number;
  readonly name: string;
  new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
}
