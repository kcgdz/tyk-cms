import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/../../lib/auth"
import { prisma } from "@/../../lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [totalPosts, publishedPosts, totalUsers, totalViews] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
      prisma.post.aggregate({ _sum: { viewCount: true } })
    ])

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      totalUsers,
      totalViews: totalViews._sum.viewCount || 0
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}