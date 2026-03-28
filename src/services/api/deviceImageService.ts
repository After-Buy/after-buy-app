type PresignedUrlResponse = {
  success: boolean;
  data: {
    presigned_url: string;
    image_url: string;
    expires_in: number;
  };
};

type FileExtension = "jpg" | "jpeg" | "png" | "webp";

export const deviceImageService = {
  async getPresignedUrl(fileExtension: FileExtension) {
    const response = await fetch("/api/devices/images/presigned-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_extension: fileExtension,
      }),
    });

    if (!response.ok) {
      throw new Error("Presigned URL 발급에 실패했습니다.");
    }

    const result: PresignedUrlResponse = await response.json();

    if (!result.success) {
      throw new Error("Presigned URL 응답이 올바르지 않습니다.");
    }

    return result.data;
  },
};
