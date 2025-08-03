import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tyk-cms.com' },
    update: {},
    create: {
      email: 'admin@tyk-cms.com',
      username: 'admin',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log({ admin })

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech news and tutorials',
        color: '#3B82F6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'Design trends and inspiration',
        color: '#10B981',
      },
    }),
  ])

  console.log({ categories })

  // Create sample post
  const post = await prisma.post.create({
    data: {
      title: 'Welcome to TYK CMS',
      slug: 'welcome-to-tyk-cms',
      content: '<h2>Welcome to your new CMS!</h2><p>This is a sample post to get you started. TYK CMS is a high-performance content management system built with Next.js 15.</p><h3>Features</h3><ul><li>Fast and secure</li><li>Modern admin interface</li><li>SEO optimized</li><li>Media management</li></ul><p>Start creating amazing content today!</p>',
      excerpt: 'Welcome to TYK CMS - A modern, fast, and scalable content management system.',
      status: 'PUBLISHED',
      featured: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categories: {
        create: {
          categoryId: categories[0].id,
        },
      },
    },
  })

  console.log({ post })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })