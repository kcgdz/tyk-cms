import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/../../lib/auth"
import { prisma } from "@/../../lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true })

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${uuidv4()}.${ext}`
    const originalFilename = `original-${filename}`
    
    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save original file
    const originalPath = join(UPLOAD_DIR, originalFilename)
    await writeFile(originalPath, buffer)

    // Process image with Sharp for optimization
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer()

    // Save optimized file
    const optimizedPath = join(UPLOAD_DIR, filename)
    await writeFile(optimizedPath, optimizedBuffer)

    // Get image metadata
    const metadata = await sharp(buffer).metadata()

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${filename}`,
        width: metadata.width,
        height: metadata.height,
      }
    })

    return NextResponse.json({
      id: media.id,
      url: media.url,
      filename: media.filename,
      originalName: media.originalName,
      size: media.size,
      width: media.width,
      height: media.height,
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    })

    return NextResponse.json({ media })
  } catch (error) {
    console.error("Media fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}