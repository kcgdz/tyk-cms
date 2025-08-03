"use client"

import { useEffect, useState } from "react"
import { FileText, Users, Eye, TrendingUp } from "lucide-react"

interface Stats {
  totalPosts: number
  totalUsers: number
  totalViews: number
  publishedPosts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    publishedPosts: 0
  })

  useEffect(() => {
    // API'den istatistikleri çek
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Stats fetch error:', error)
    }
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Published Posts", 
      value: stats.publishedPosts,
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your CMS dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
          <div className="space-y-3">
            <div className="text-gray-600">No recent posts</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FileText className="h-5 w-5 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-blue-900">New Post</div>
            </button>
            <button className="p-3 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Users className="h-5 w-5 text-green-600 mb-2" />
              <div className="text-sm font-medium text-green-900">Manage Users</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}