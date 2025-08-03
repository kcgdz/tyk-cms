import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

// Cache configurations
export const CACHE_TAGS = {
  POSTS: 'posts',
  POST: 'post',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  USERS: 'users',
  STATS: 'stats',
} as const

export const CACHE_TIMES = {
  SHORT: 300, // 5 minutes
  MEDIUM: 900, // 15 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const

// Cached data fetchers
export const getCachedPosts = unstable_cache(
  async (page = 1, limit = 10, status?: string, search?: string) => {
    const where: any = {}
    
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where })
    ])

    return { posts, total, pages: Math.ceil(total / limit) }
  },
  ['posts'],
  {
    revalidate: CACHE_TIMES.MEDIUM,
    tags: [CACHE_TAGS.POSTS]
  }
)

export const getCachedPost = unstable_cache(
  async (slug: string) => {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        media: true
      }
    })

    if (post) {
      // Increment view count
      await prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } }
      })
    }

    return post
  },
  ['post'],
  {
    revalidate: CACHE_TIMES.SHORT,
    tags: [CACHE_TAGS.POST]
  }
)

export const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })
  },
  ['categories'],
  {
    revalidate: CACHE_TIMES.LONG,
    tags: [CACHE_TAGS.CATEGORIES]
  }
)

export const getCachedTags = unstable_cache(
  async () => {
    return await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })
  },
  ['tags'],
  {
    revalidate: CACHE_TIMES.LONG,
    tags: [CACHE_TAGS.TAGS]
  }
)

export const getCachedStats = unstable_cache(
  async () => {
    const [totalPosts, publishedPosts, totalUsers, totalViews] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count(),
      prisma.post.aggregate({ _sum: { viewCount: true } })
    ])

    return {
      totalPosts,
      publishedPosts,
      totalUsers,
      totalViews: totalViews._sum.viewCount || 0
    }
  },
  ['stats'],
  {
    revalidate: CACHE_TIMES.MEDIUM,
    tags: [CACHE_TAGS.STATS]
  }
)

// Cache invalidation helpers
export function invalidatePostsCache() {
  // This would be implemented with revalidateTag in production
  console.log('Invalidating posts cache')
}

export function invalidatePostCache(slug: string) {
  // This would be implemented with revalidateTag in production
  console.log(`Invalidating post cache for: ${slug}`)
}