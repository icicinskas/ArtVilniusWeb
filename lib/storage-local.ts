/**
 * Lokalus failų saugojimas - be AWS SDK priklausomybių.
 * Naudojamas kai STORAGE_TYPE=local
 */

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const LOCAL_UPLOAD_DIR = join(process.cwd(), "public", "uploads")

async function ensureDirectoryExists(folderPath: string): Promise<void> {
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true })
  }
}

export interface UploadFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

export async function uploadFileLocal(
  file: UploadFile,
  folder: string = "general"
): Promise<string> {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.originalname.split(".").pop() || "bin"
  const fileName = `${timestamp}-${randomString}.${extension}`

  const folderPath = join(LOCAL_UPLOAD_DIR, folder)
  await ensureDirectoryExists(folderPath)
  const fullPath = join(folderPath, fileName)
  await writeFile(fullPath, file.buffer)

  return `/uploads/${folder}/${fileName}`
}
