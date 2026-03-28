/**
 * Storage Utility - Failų saugojimo sistema
 *
 * Šis failas apibrėžia abstrakciją failų saugojimui su dviem variantais:
 * 1. AWS S3 (cloud storage) - geriau production aplinkai
 * 2. Lokalus saugojimas - geriau development aplinkai
 *
 * Naudojimas:
 * - Importuokite: import { uploadFile, deleteFile, getFileUrl } from '@/lib/storage'
 * - Įkelkite failą: const url = await uploadFile(file, 'artworks')
 * - Ištrinkite failą: await deleteFile(url)
 */

import { writeFile, unlink, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Storage tipas iš .env failo
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local" // 's3' arba 'local'

// ============================================
// AWS S3 - dinaminis importas (įkeliamas tik kai STORAGE_TYPE=s3)
// ============================================

let s3Client: unknown = null

async function getS3Client(): Promise<unknown> {
  if (s3Client) return s3Client
  if (STORAGE_TYPE !== "s3") return null

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials nerastos .env faile")
  }

  const { S3Client } = await import("@aws-sdk/client-s3")
  s3Client = new S3Client({
    region: process.env.AWS_REGION || "eu-west-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  return s3Client
}

// ============================================
// LOKALUS SAUGOJIMAS
// ============================================

const LOCAL_UPLOAD_DIR = join(process.cwd(), "public", "uploads")

async function ensureDirectoryExists(folderPath: string): Promise<void> {
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true })
  }
}

// ============================================
// ABSTRAKCIJOS FUNKCIJOS
// ============================================

export interface UploadFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

export async function uploadFile(
  file: UploadFile,
  folder: string = "general"
): Promise<string> {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.originalname.split(".").pop() || "bin"
  const fileName = `${timestamp}-${randomString}.${extension}`
  const filePath = `${folder}/${fileName}`

  if (STORAGE_TYPE === "s3") {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET nerastas .env faile")
    }

    const client = await getS3Client()
    if (!client) throw new Error("S3 klientas neinicializuotas")

    const { PutObjectCommand } = await import("@aws-sdk/client-s3")
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    await (client as { send: (cmd: unknown) => Promise<unknown> }).send(command)

    const region = process.env.AWS_REGION || "eu-west-1"
    return `https://${process.env.AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${filePath}`
  }

  const folderPath = join(LOCAL_UPLOAD_DIR, folder)
  await ensureDirectoryExists(folderPath)
  const fullPath = join(folderPath, fileName)
  await writeFile(fullPath, file.buffer)
  return `/uploads/${folder}/${fileName}`
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (STORAGE_TYPE === "s3") {
    const urlParts = fileUrl.split(".amazonaws.com/")
    if (urlParts.length !== 2) {
      throw new Error("Netinkamas S3 URL formatas")
    }

    const filePath = urlParts[1]
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET nerastas .env faile")
    }

    const client = await getS3Client()
    if (!client) throw new Error("S3 klientas neinicializuotas")

    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3")
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filePath,
    })

    await (client as { send: (cmd: unknown) => Promise<unknown> }).send(command)
  } else {
    if (!fileUrl.startsWith("/uploads/")) {
      throw new Error("Netinkamas lokalaus failo URL formatas")
    }

    const fullPath = join(process.cwd(), "public", fileUrl)
    try {
      await unlink(fullPath)
    } catch (error) {
      console.warn(`Failas nebuvo rastas: ${fullPath}`)
    }
  }
}

export async function getFileUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  if (STORAGE_TYPE === "s3") {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error("AWS_S3_BUCKET nerastas .env faile")
    }

    const client = await getS3Client()
    if (!client) throw new Error("S3 klientas neinicializuotas")

    const { GetObjectCommand } = await import("@aws-sdk/client-s3")
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner")
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filePath,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await getSignedUrl(client as any, command, { expiresIn })
  }

  return `/uploads/${filePath}`
}

export function isStorageConfigured(): boolean {
  if (STORAGE_TYPE === "s3") {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_REGION &&
      process.env.AWS_S3_BUCKET
    )
  }
  return true
}

export function getStorageType(): "s3" | "local" {
  return STORAGE_TYPE === "s3" ? "s3" : "local"
}
