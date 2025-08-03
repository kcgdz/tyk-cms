import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  publishedTime?: string
  author?: string
  tags?: string[]
}

export function generateSEO({
  title = 'TYK CMS',
  description = 'High-performance content management system',
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  publishedTime,
  author,
  tags = [],
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const fullUrl = `${siteUrl}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    title,
    description,
    keywords: tags.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'TYK CMS',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: type as any,
      publishedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStructuredData({
  title,
  description,
  url,
  publishedTime,
  author,
  image,
}: SEOProps) {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image?.startsWith('http') ? image : `${siteUrl}${image}`,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TYK CMS',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${url}`,
    },
  }
}