"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, X, Eye, Download } from "lucide-react"
import Image from "next/image"

interface MediaFile {
  id: string
  url: string
  filename: string
  originalName: string
  size: number
  width?: number
  height?: number
}

interface MediaUploaderProps {
  onUpload?: (file: MediaFile) => void
  multiple?: boolean
  maxFiles?: number
}

export function MediaUploader({ onUpload, multiple = false, maxFiles = 1 }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([])
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setPreviewFiles(acceptedFiles)
    setUploading(true)

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        return await response.json()
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles(prev => [...prev, ...results])
      
      results.forEach(file => {
        onUpload?.(file)
      })
      
      setPreviewFiles([])
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple,
    maxFiles,
    disabled: uploading
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload media files'}
        </p>
        <p className="text-sm text-gray-500">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports: JPEG, PNG, WebP, GIF (max 10MB)
        </p>
      </div>

      {/* Preview uploading files */}
      {previewFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploading...</h4>
          {previewFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={file.id} className="border rounded-lg overflow-hidden bg-white">
                <div className="relative aspect-video">
                  <Image
                    src={file.url}
                    alt={file.originalName}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{file.originalName}</p>
                  <p className="text-xs text-gray-500">
                    {file.width}×{file.height} • {formatFileSize(file.size)}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const a = document.createElement('a')
                        a.href = file.url
                        a.download = file.originalName
                        a.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}