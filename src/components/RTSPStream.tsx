'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Maximize2, Volume2, VolumeX, Camera, Wifi, WifiOff, RotateCcw, Settings } from 'lucide-react'

interface RTSPStreamProps {
  cameraId: string
  cameraName: string
  location: string
  status: 'online' | 'offline' | 'recording'
  resolution: string
  fps: number
  currentTime: string
  rtspUrl?: string
  streamType?: 'HLS' | 'RTSP' | 'MJPEG'
}

export default function RTSPStream({ 
  cameraId, 
  cameraName, 
  location, 
  status, 
  resolution, 
  fps, 
  currentTime,
  rtspUrl,
  streamType = 'HLS'
}: RTSPStreamProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'idle'>('idle')
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [showSettings, setShowSettings] = useState(false)
  const [customRtspUrl, setCustomRtspUrl] = useState(rtspUrl || '')
  const [streamError, setStreamError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)
  const streamRef = useRef<any>(null)

  // Get appropriate stream URL
  const getStreamUrl = useCallback(() => {
    if (customRtspUrl) {
      return customRtspUrl
    }
    
    // Fallback to demo URLs based on stream type
    switch (streamType) {
      case 'HLS':
        // Demo HLS stream (you would replace with your actual HLS URL)
        return `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`
      case 'RTSP':
        // For RTSP, you need a proxy server to convert RTSP to WebRTC/WebSocket
        // This is a placeholder - you'd need RTSP proxy like rtsp-simple-server
        return `ws://localhost:8080/stream/${cameraId}`
      case 'MJPEG':
        // MJPEG stream URL
        return `https://picsum.photos/seed/cctv${cameraId}/1920/1080.jpg`
      default:
        return `https://picsum.photos/seed/cctv${cameraId}/1920/1080.jpg`
    }
  }, [customRtspUrl, streamType, cameraId])

  // Initialize HLS stream
  const initializeHLS = useCallback(async () => {
    if (!videoRef.current) return

    try {
      // Dynamically import Hls.js to avoid SSR issues
      const Hls = (await import('hls.js')).default
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        })
        
        hls.loadSource(getStreamUrl())
        hls.attachMedia(videoRef.current)
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed, starting playback')
          videoRef.current?.play()
          setIsPlaying(true)
          setConnectionStatus('connected')
        })
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data)
          setStreamError(`HLS Error: ${data.details}`)
          setConnectionStatus('error')
        })
        
        hlsRef.current = hls
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = getStreamUrl()
        videoRef.current.play()
        setIsPlaying(true)
        setConnectionStatus('connected')
      }
    } catch (error) {
      console.error('Error initializing HLS:', error)
      setStreamError('Failed to initialize HLS stream')
      setConnectionStatus('error')
    }
  }, [getStreamUrl])

  // Initialize MJPEG stream
  const initializeMJPEG = useCallback(() => {
    if (!canvasRef.current) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    const updateFrame = () => {
      if (!canvasRef.current || !img.complete) return
      
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
      }
      
      if (isPlaying) {
        requestAnimationFrame(updateFrame)
      }
    }

    img.onload = () => {
      setIsPlaying(true)
      setConnectionStatus('connected')
      updateFrame()
    }

    img.onerror = () => {
      setStreamError('Failed to load MJPEG stream')
      setConnectionStatus('error')
    }

    img.src = getStreamUrl()
    streamRef.current = { img, updateFrame }
  }, [getStreamUrl, isPlaying])

  // Initialize stream based on type
  const initializeStream = useCallback(async () => {
    setConnectionStatus('connecting')
    setStreamError(null)
    setLastUpdate(Date.now())

    switch (streamType) {
      case 'HLS':
        await initializeHLS()
        break
      case 'MJPEG':
        initializeMJPEG()
        break
      case 'RTSP':
        // RTSP requires WebSocket/Proxy server
        // For now, fall back to MJPEG
        initializeMJPEG()
        break
      default:
        initializeMJPEG()
    }
  }, [streamType, initializeHLS, initializeMJPEG])

  // Auto-reconnect logic
  useEffect(() => {
    if (status !== 'offline' && connectionStatus === 'idle') {
      initializeStream()
    }

    // Auto-reconnect every 30 seconds if disconnected
    const reconnectInterval = setInterval(() => {
      if (status !== 'offline' && connectionStatus === 'error') {
        console.log('Attempting to reconnect...')
        initializeStream()
      }
    }, 30000)

    return () => clearInterval(reconnectInterval)
  }, [status, connectionStatus, initializeStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
      if (streamRef.current) {
        // Cleanup stream resources
      }
    }
  }, [])

  const handlePlayPause = async () => {
    if (streamType === 'HLS' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        try {
          await videoRef.current.play()
        } catch (error) {
          console.error('Play failed:', error)
        }
      }
      setIsPlaying(!isPlaying)
    } else if (streamType === 'MJPEG' && streamRef.current) {
      if (isPlaying) {
        setIsPlaying(false)
      } else {
        streamRef.current.updateFrame()
        setIsPlaying(true)
      }
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
    // Cleanup existing stream
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    
    setConnectionStatus('idle')
    setIsPlaying(false)
    setStreamError(null)
    
    // Reinitialize
    setTimeout(() => {
      initializeStream()
    }, 1000)
  }

  const handleSettingsSave = () => {
    // Here you would save the custom RTSP URL to your backend
    console.log('Saving RTSP URL:', customRtspUrl)
    setShowSettings(false)
    handleRefresh()
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
            {/* HLS Video Element */}
            {streamType === 'HLS' && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                playsInline
                controls={false}
              />
            )}

            {/* MJPEG Canvas */}
            {(streamType === 'MJPEG' || streamType === 'RTSP') && (
              <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
            )}

            {/* Connection indicator */}
            {connectionStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-green-400">Connecting to {streamType} stream...</p>
                </div>
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-400">Stream Error</p>
                  {streamError && <p className="text-xs text-red-300 mt-1">{streamError}</p>}
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

            {/* Video overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Time overlay */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
                {currentTime}
              </div>
              
              {/* Camera info overlay */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {cameraId} • {streamType}
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
                  <span>{resolution} • {fps} FPS • {streamType}</span>
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
              disabled={status === 'offline' || connectionStatus !== 'connected'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            {streamType === 'HLS' && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
                onClick={handleMuteToggle}
                disabled={status === 'offline'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            )}

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

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
              onClick={() => setShowSettings(!showSettings)}
              title="Stream Settings"
            >
              <Settings className="w-4 h-4" />
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg w-80 z-10">
          <h3 className="text-sm font-semibold mb-3">Stream Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300">Stream Type</label>
              <div className="text-sm font-mono bg-black/50 p-2 rounded">
                {streamType}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-300">RTSP URL</label>
              <input
                type="text"
                value={customRtspUrl}
                onChange={(e) => setCustomRtspUrl(e.target.value)}
                placeholder="rtsp://username:password@ip:port/stream"
                className="w-full text-sm bg-black/50 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div className="text-xs text-gray-400">
              <p>Example formats:</p>
              <p className="font-mono">rtsp://admin:password@192.168.1.100:554/stream1</p>
              <p className="font-mono">rtsp://192.168.1.100:554/live</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSettingsSave}
                className="bg-green-600 hover:bg-green-700"
              >
                Save & Connect
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}