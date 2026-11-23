import { s3Storage } from "@payloadcms/storage-s3";

// Keep the media schema identical for local disks and hosted object storage.
// Downloads stay behind Payload's same-origin /api/media/file endpoint.
export const mediaStorage = s3Storage({
  enabled: process.env.MEDIA_STORAGE === "s3",
  alwaysInsertFields: true,
  bucket: process.env.S3_BUCKET || "",
  collections: { media: true },
  config: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          }
        : undefined,
    // Supabase's S3 endpoint accepts standard checksums on required operations.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  },
});
