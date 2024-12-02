'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Share2, Trash2, Search, Grid, List, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export type FileType = {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  url: string
}

const TeamMediaManager = () => {
  const [files, setFiles] = useState<FileType[]>([])
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const { toast } = useToast()

  const handleFileUpload = (file: File) => {
    const newFile: FileType = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
    }
    setFiles([...files, newFile])
    toast({
      title: 'File uploaded',
      description: `${file.name} has been successfully uploaded.`,
    })
  }

  const handleFileDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id))
    toast({
      title: 'File deleted',
      description: 'The file has been successfully deleted.',
      variant: 'destructive',
    })
  }

  const handleFileDownload = (file: FileType) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: 'File download started',
      description: `${file.name} is being downloaded.`,
    })
  }

  const handleFileShare = (file: FileType) => {
    navigator.clipboard.writeText(file.url)
    toast({
      title: 'Share link copied',
      description: `A shareable link for ${file.name} has been copied to your clipboard.`,
    })
  }

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || file.type.startsWith(filterType))
  )

  const FileUploader = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      acceptedFiles.forEach(handleFileUpload)
    }, [])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
    })

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or</p>
        <Button onClick={open} className="mt-4">
          Select Files
        </Button>
      </div>
    )
  }

  const FileGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredFiles.map((file) => (
        <Card key={file.id} className="overflow-hidden transition-shadow hover:shadow-lg">
          <CardContent className="p-4">
            {file.type.startsWith('image/') ? (
              <img src={file.url} alt={file.name} className="w-full h-48 object-cover rounded-md" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
                <FileIcon className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4 bg-gray-50">
            <h3 className="font-semibold text-sm mb-1 truncate w-full">{file.name}</h3>
            <div className="flex justify-between items-center w-full mb-2">
              <Badge variant="secondary" className="text-xs">
                {file.type.split('/')[1].toUpperCase()}
              </Badge>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
            </p>
            <div className="flex justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFileShare(file)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFileDelete(file.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  const FileList = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {file.type.split('/')[1].toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
              <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFileShare(file)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFileDelete(file.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )

  return (
    <div className="bg-purple-50 min-h-screen p-8 space-y-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-8">Team Media Manager</h1>
        <Card className="mb-8">
          <CardContent className="p-6">
            <FileUploader />
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 w-full sm:w-64"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image/">Images</SelectItem>
                <SelectItem value="video/">Videos</SelectItem>
                <SelectItem value="audio/">Audio</SelectItem>
                <SelectItem value="application/">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          {view === 'grid' ? <FileGrid /> : <FileList />}
        </ScrollArea>
      </div>
    </div>
  )
}

export default TeamMediaManager

