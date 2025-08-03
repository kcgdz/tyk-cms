"use client"

import { useState, useEffect } from "react"
import { MediaUploader } from "@/components/upload/media-uploader"
import { Button } from "@/components/ui/button"
import { Search, Grid, List, Trash2, Download, Eye } from "lucide-react"
import Image from "next/image"

interface MediaFile {
  id: string
  url: string
  filename: string
  originalName: string
  size: number
  width?: number
  height?: number
  createdAt: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/upload')
      const data = await response.json()
      setMedia(data.media || [])
    } catch (error) {
      console.error('Fetch media error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = (file: MediaFile) => {
    setMedia(prev => [file, ...prev])
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await fetch(`/api/upload/${id}`, { method: 'DELETE' })
        setMedia(prev => prev.filter(item => item.id !== id))
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredMedia = media.filter(item =>
    item.originalName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600">Upload and manage your media files</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Media</h2>
        <MediaUploader onUpload={handleUpload} multiple maxFiles={10} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading media...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No media files found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredMedia.map((file) => (
                <div key={file.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={file.url}
                      alt={file.originalName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.width}×{file.height}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                    <div className="flex space-x-1 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-1 h-6 w-6"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const a = document.createElement('a')
                          a.href = file.url
                          a.download = file.originalName
                          a.click()
                        }}
                        className="p-1 h-6 w-6"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(file.id)}
                        className="p-1 h-6 w-6 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedia.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={file.url}
                            alt={file.originalName}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {file.originalName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {file.width}×{file.height}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const a = document.createElement('a')
                              a.href = file.url
                              a.download = file.originalName
                              a.click()
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}