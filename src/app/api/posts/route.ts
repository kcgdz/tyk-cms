import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/../../lib/auth"
import { prisma } from "@/../../lib/prisma"
import { z } from "zod"

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}
    
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } }
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Posts GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        slug,
        authorId: session.user.id,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
        categories: validatedData.categoryIds ? {
          create: validatedData.categoryIds.map(id => ({ categoryId: id }))
        } : undefined,
        tags: validatedData.tagIds ? {
          create: validatedData.tagIds.map(id => ({ tagId: id }))
        } : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Posts POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}