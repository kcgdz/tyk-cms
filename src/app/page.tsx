"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Eye, ArrowRight } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: string
  publishedAt: string
  viewCount: number
  author: {
    name: string
    avatar?: string
  }
  categories: Array<{
    category: {
      name: string
      slug: string
    }
  }>
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?status=PUBLISHED&limit=6')
      const data = await response.json()
      const publishedPosts = data.posts || []
      
      const featured = publishedPosts.find((p: Post) => p.featuredImage) || publishedPosts[0]
      setFeaturedPost(featured)
      
      setPosts(publishedPosts.filter((p: Post) => p.id !== featured?.id))
    } catch (error) {
      console.error('Fetch posts error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TYK CMS</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </nav>
            </div>
            <Link 
              href="/admin" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {featuredPost && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-2 text-sm text-blue-600 mb-4">
                  {featuredPost.categories[0] && (
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {featuredPost.categories[0].category.name}
                    </span>
                  )}
                  <span>Featured Post</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{featuredPost.author.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{featuredPost.viewCount} views</span>
                  </div>
                </div>
                <Link 
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {featuredPost.featuredImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Posts</h2>
            <p className="text-lg text-gray-600">
              Discover our latest articles and insights
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <div className="relative aspect-video">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.categories[0] && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                        {post.categories[0].category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/blog"
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              <span>View All Posts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">TYK CMS</h3>
              <p className="text-gray-400 mb-4">
                High-performance content management system built with Next.js, 
                designed for speed, scalability, and developer experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Admin</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/admin/posts" className="hover:text-white">Posts</Link></li>
                <li><Link href="/admin/media" className="hover:text-white">Media</Link></li>
                <li><Link href="/admin/settings" className="hover:text-white">Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TYK CMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
