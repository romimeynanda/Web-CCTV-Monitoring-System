'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Maximize2, Volume2, VolumeX, Camera, Wifi, WifiOff, RotateCcw } from 'lucide-react'

interface VideoStreamProps {
  cameraId: string
  cameraName: string
  location: string
  status: 'online' | 'offline' | 'recording'
  resolution: string
  fps: number
  currentTime: string
}

export default function VideoStream({ 
  cameraId, 
  cameraName, 
  location, 
  status, 
  resolution, 
  fps, 
  currentTime 
}: VideoStreamProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [streamUrl, setStreamUrl] = useState('')
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate realistic video stream URL based on camera ID and time
  const getStreamUrl = () => {
    // Using placeholder video service with different seeds for each camera
    // Add timestamp to prevent caching and simulate live stream
    const seed = cameraId.replace('CAM', '')
    const timestamp = Date.now()
    return `https://picsum.photos/seed/cctv${seed}${timestamp}/1920/1080.jpg`
  }

  // Simulate video stream connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus(status === 'offline' ? 'error' : 'connected')
      setStreamUrl(getStreamUrl())
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [status, cameraId])

  // Auto-refresh for live stream effect
  useEffect(() => {
    if (status !== 'offline' && connectionStatus === 'connected') {
      const interval = setInterval(() => {
        setStreamUrl(getStreamUrl())
        setLastUpdate(Date.now())
      }, 3000) // Refresh every 3 seconds for live effect
      
      return () => clearInterval(interval)
    }
  }, [status, connectionStatus, cameraId])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(e => console.log('Play failed:', e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleRefresh = () => {
    setConnectionStatus('connecting')
    setStreamUrl('')
    setTimeout(() => {
      setStreamUrl(getStreamUrl())
      setConnectionStatus(status === 'offline' ? 'error' : 'connected')
      setLastUpdate(Date.now())
    }, 1000)
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
      case 'online': return <Badge variant="default" className="bg-green-100 text-green-800">Live</Badge>
      case 'recording': return <Badge variant="default" className="bg-red-100 text-red-800 flex items-center gap-1">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Recording
      </Badge>
      case 'offline': return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Offline</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group"
    >
      {/* Video Stream */}
      <div className="absolute inset-0">
        {status === 'offline' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <WifiOff className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Camera Offline</p>
              <p className="text-xs text-gray-600 mt-1">{cameraId}</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Simulated video stream with animated effect */}
            <div className="absolute inset-0">
              {streamUrl && (
                <img 
                  key={streamUrl} // Key change forces re-render
                  src={streamUrl}
                  alt={`CCTV ${cameraName}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{
                    filter: connectionStatus === 'connecting' ? 'blur(2px)' : 'none',
                    opacity: connectionStatus === 'connecting' ? 0.7 : 1
                  }}
                />
              )}
              
              {/* Animated scan lines for realistic effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent animate-pulse"></div>
                <div 
                  className="absolute w-full h-px bg-green-500/20"
                  style={{
                    animation: 'scan 8s linear infinite',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                  }}
                ></div>
                {/* Random noise effect */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    animation: 'noise 0.2s steps(10) infinite'
                  }}
                ></div>
              </div>

              {/* Connection indicator */}
              {connectionStatus === 'connecting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-green-400">Connecting...</p>
                  </div>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-400">Connection Error</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="mt-2 text-white border-white hover:bg-white hover:text-black"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Video overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Time overlay */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
                {currentTime}
              </div>
              
              {/* Camera info overlay */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {cameraId}
              </div>
              
              {/* Location overlay */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {location}
              </div>

              {/* Live indicator */}
              {status === 'online' && connectionStatus === 'connected' && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                </div>
              )}

              {/* Recording indicator */}
              {status === 'recording' && connectionStatus === 'connected' && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    REC
                  </div>
                </div>
              )}

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>{resolution} • {fps} FPS</span>
                  <div className="flex items-center gap-2">
                    {connectionStatus === 'connected' && <Wifi className="w-3 h-3 text-green-400" />}
                    <span>{cameraName}</span>
                  </div>
                </div>
              </div>

              {/* Last update indicator */}
              {connectionStatus === 'connected' && (
                <div className="absolute top-8 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Updated: {new Date(lastUpdate).toLocaleTimeString('id-ID')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
              onClick={handlePlayPause}
              disabled={status === 'offline'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
              onClick={handleMuteToggle}
              disabled={status === 'offline'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
              onClick={handleRefresh}
              disabled={status === 'offline'}
              title="Refresh Stream"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1 h-8 w-8"
            onClick={handleFullscreen}
            disabled={status === 'offline'}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add CSS animation for scan line and noise */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1px, -1px); }
          20% { transform: translate(1px, 1px); }
          30% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          50% { transform: translate(-1px, 2px); }
          60% { transform: translate(1px, -2px); }
          70% { transform: translate(2px, 1px); }
          80% { transform: translate(-2px, -1px); }
          90% { transform: translate(1px, 2px); }
        }
      `}</style>
    </div>
  )
}