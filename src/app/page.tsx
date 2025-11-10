'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Camera, Monitor, Grid3X3, Square, Maximize2, PlayCircle, AlertCircle, Search, Eye, EyeOff, Menu, X, RefreshCw } from 'lucide-react'
import RTSPStream from '@/components/RTSPStream'

interface CameraData {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'recording'
  lastUpdate: string
  resolution: string
  fps: number
  rtspUrl?: string
  streamType?: 'HLS' | 'RTSP' | 'MJPEG'
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [gridLayout, setGridLayout] = useState('2x2')
  const [selectedCameras, setSelectedCameras] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cameras, setCameras] = useState<CameraData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCameras = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cameras')
      const result = await response.json()
      
      if (result.success) {
        setCameras(result.data)
        // Auto-select first cameras based on grid layout
        const cameraCount = parseInt(gridLayout.split('x')[0]) * parseInt(gridLayout.split('x')[1])
        setSelectedCameras(result.data.slice(0, cameraCount).map((c: CameraData) => c.id))
      } else {
        setError('Failed to load cameras')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error('Error fetching cameras:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCameras()
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Otomatis sesuaikan jumlah kamera berdasarkan layout
    const cameraCount = parseInt(gridLayout.split('x')[0]) * parseInt(gridLayout.split('x')[1])
    const newSelectedCameras = cameras.slice(0, cameraCount).map(c => c.id)
    setSelectedCameras(newSelectedCameras)
  }, [gridLayout, cameras])

  const handleCameraToggle = (cameraId: string, checked: boolean) => {
    if (checked) {
      // Batasi jumlah kamera sesuai layout
      const maxCameras = parseInt(gridLayout.split('x')[0]) * parseInt(gridLayout.split('x')[1])
      if (selectedCameras.length < maxCameras) {
        setSelectedCameras([...selectedCameras, cameraId])
      }
    } else {
      setSelectedCameras(selectedCameras.filter(id => id !== cameraId))
    }
  }

  const filteredCameras = cameras.filter(camera => 
    camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getGridCols = (layout: string) => {
    switch (layout) {
      case '1x1': return 'grid-cols-1'
      case '2x2': return 'grid-cols-2'
      case '3x3': return 'grid-cols-3'
      case '4x4': return 'grid-cols-4'
      default: return 'grid-cols-2'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'recording': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
      case 'recording': return <Badge variant="default" className="bg-red-100 text-red-800">Recording</Badge>
      case 'offline': return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Offline</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const CameraFeed = ({ camera }: { camera: CameraData }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{camera.name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)} animate-pulse`}></div>
            {getStatusBadge(camera.status)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {camera.location} • {camera.id} • {camera.streamType}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <RTSPStream
          cameraId={camera.id}
          cameraName={camera.name}
          location={camera.location}
          status={camera.status}
          resolution={camera.resolution}
          fps={camera.fps}
          currentTime={currentTime.toLocaleTimeString('id-ID')}
          rtspUrl={camera.rtspUrl}
          streamType={camera.streamType}
        />
      </CardContent>
    </Card>
  )

  const displayedCameras = cameras.filter(camera => selectedCameras.includes(camera.id))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading CCTV System...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-600">{error}</p>
          <Button onClick={fetchCameras} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-40 w-80 h-screen bg-card border-r transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Daftar Kamera</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari kamera..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Camera List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredCameras.map((camera) => (
              <Card key={camera.id} className="p-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={camera.id}
                    checked={selectedCameras.includes(camera.id)}
                    onCheckedChange={(checked) => handleCameraToggle(camera.id, checked as boolean)}
                    disabled={!selectedCameras.includes(camera.id) && selectedCameras.length >= (parseInt(gridLayout.split('x')[0]) * parseInt(gridLayout.split('x')[1]))}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor={camera.id} 
                        className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                      >
                        {camera.name}
                      </label>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)} animate-pulse`}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {camera.id} • {camera.location}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {getStatusBadge(camera.status)}
                      <div className="text-xs text-muted-foreground">
                        {camera.resolution}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedCameras.length} / {parseInt(gridLayout.split('x')[0]) * parseInt(gridLayout.split('x')[1])} kamera dipilih
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold">CCTV Monitoring System</h1>
                </div>
                <Badge variant="outline" className="ml-4">
                  {cameras.filter(c => c.status !== 'offline').length} / {cameras.length} Online
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-lg font-mono font-medium">
                  {currentTime.toLocaleTimeString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="border-b bg-card/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Layout:</span>
                  <Select value={gridLayout} onValueChange={setGridLayout}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1x1">1×1</SelectItem>
                      <SelectItem value="2x2">2×2</SelectItem>
                      <SelectItem value="3x3">3×3</SelectItem>
                      <SelectItem value="4x4">4×4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Kamera:</span>
                  <Badge variant="outline">{displayedCameras.length} Aktif</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={fetchCameras}
                  title="Refresh all cameras"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Play All
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className={`grid ${getGridCols(gridLayout)} gap-4`}>
            {displayedCameras.map((camera) => (
              <CameraFeed key={camera.id} camera={camera} />
            ))}
          </div>

          {/* Status Summary */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Kamera</p>
                    <p className="text-2xl font-bold">{cameras.length}</p>
                  </div>
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Online</p>
                    <p className="text-2xl font-bold text-green-600">{cameras.filter(c => c.status === 'online').length}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Recording</p>
                    <p className="text-2xl font-bold text-red-600">{cameras.filter(c => c.status === 'recording').length}</p>
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Offline</p>
                    <p className="text-2xl font-bold text-gray-600">{cameras.filter(c => c.status === 'offline').length}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}