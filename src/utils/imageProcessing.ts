import imageCompression from "browser-image-compression";

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CompressOptions {
  maxWidthOrHeight?: number;
  initialQuality?: number;
  maxSizeMB?: number;
}

const DEFAULTS: Required<CompressOptions> = {
  maxWidthOrHeight: 1600,
  initialQuality: 0.7,
  maxSizeMB: 1,
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

export async function cropImageToBlob(
  srcUrl: string,
  area: CroppedAreaPixels,
): Promise<Blob> {
  const img = await loadImage(srcUrl);
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
    );
  });
}

const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");

export async function compressToWebp(
  source: Blob,
  originalName: string,
  opts: CompressOptions = {},
): Promise<File> {
  const merged = { ...DEFAULTS, ...opts };
  const inputFile =
    source instanceof File
      ? source
      : new File([source], `${stripExt(originalName)}.png`, { type: source.type });

  const compressed = await imageCompression(inputFile, {
    maxSizeMB: merged.maxSizeMB,
    maxWidthOrHeight: merged.maxWidthOrHeight,
    initialQuality: merged.initialQuality,
    useWebWorker: true,
    fileType: "image/webp",
  });

  return new File([compressed], `${stripExt(originalName)}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export async function processImage(
  source: File,
  area: CroppedAreaPixels,
  opts?: CompressOptions,
): Promise<File> {
  const url = URL.createObjectURL(source);
  try {
    const cropped = await cropImageToBlob(url, area);
    return await compressToWebp(cropped, source.name, opts);
  } finally {
    URL.revokeObjectURL(url);
  }
}
