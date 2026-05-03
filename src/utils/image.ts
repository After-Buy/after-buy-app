export const getFileExtension = (
  fileName?: string | null,
  mimeType?: string | null,
  uri?: string,
): "jpg" | "jpeg" | "png" | "webp" => {
  const lowerFileName = fileName?.toLowerCase() ?? "";
  const lowerMimeType = mimeType?.toLowerCase() ?? "";
  const lowerUri = uri?.toLowerCase() ?? "";

  if (
    lowerFileName.endsWith(".png") ||
    lowerMimeType.includes("png") ||
    lowerUri.endsWith(".png")
  ) {
    return "png";
  }

  if (
    lowerFileName.endsWith(".webp") ||
    lowerMimeType.includes("webp") ||
    lowerUri.endsWith(".webp")
  ) {
    return "webp";
  }

  if (
    lowerFileName.endsWith(".jpeg") ||
    lowerMimeType.includes("jpeg") ||
    lowerUri.endsWith(".jpeg")
  ) {
    return "jpeg";
  }

  return "jpg";
};
