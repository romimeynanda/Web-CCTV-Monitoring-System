# RTSP CCTV Integration Setup Guide

## Overview
This CCTV monitoring system now supports RTSP (Real-Time Streaming Protocol) for real camera feeds.

## Supported Stream Types

### 1. RTSP (Direct Connection)
- **Protocol**: `rtsp://username:password@ip:port/stream`
- **Best for**: Direct camera connection
- **Requirements**: RTSP proxy server (see setup below)

### 2. HLS (HTTP Live Streaming)
- **Protocol**: `http://server/stream/playlist.m3u8`
- **Best for**: Web browsers, mobile devices
- **Requirements**: RTSP to HLS conversion

### 3. MJPEG (Motion JPEG)
- **Protocol**: `http://server/stream.mjpg`
- **Best for**: Simple web streaming
- **Requirements**: HTTP server with MJPEG support

## RTSP Proxy Server Setup

### Option 1: MediaMTX (Recommended)
```bash
# Download and install MediaMTX
wget https://github.com/bluenviron/mediamtx/releases/download/v1.0.0/mediamtx_v1.0.0_linux_amd64.tar.gz
tar -xzf mediamtx_v1.0.0_linux_amd64.tar.gz
cd mediamtx_v1.0.0_linux_amd64

# Configure
nano mediamtx.yml
```

**mediamtx.yml configuration:**
```yaml
paths:
  CAM001:
    source: rtsp://admin:password@192.168.1.101:554/stream1
    runOnDemand: yes
  CAM002:
    source: rtsp://admin:password@192.168.1.102:554/live
    runOnDemand: yes
  # Add more cameras as needed
```

**Start the server:**
```bash
./mediamtx
```

### Option 2: FFmpeg + HLS
```bash
# Convert RTSP to HLS
ffmpeg -i rtsp://admin:password@192.168.1.101:554/stream1 \
  -c:v copy -c:a copy -f hls -hls_time 2 -hls_list_size 3 \
  -hls_flags delete_segments stream.m3u8
```

### Option 3: Docker Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  mediamtx:
    image: aler9/rtsp-simple-server
    ports:
      - "8554:8554"  # RTSP
      - "8888:8888"  # HLS
      - "8889:8889"  # WebRTC
    volumes:
      - ./mediamtx.yml:/mediamtx.yml
```

## Camera Configuration Examples

### Hikvision Cameras
```
rtsp://admin:password123@192.168.1.100:554/Streaming/Channels/101
```

### Dahua Cameras
```
rtsp://admin:password123@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0
```

### Axis Cameras
```
rtsp://root:password@192.168.1.100:554/axis-media/media.amp
```

### Generic ONVIF Cameras
```
rtsp://admin:password@192.168.1.100:554/live
rtsp://admin:password@192.168.1.100:554/stream1
rtsp://admin:password@192.168.1.100:554/cam/realmonitor?channel=1
```

## Web Application Configuration

### Adding RTSP URLs via UI
1. Click the settings icon (⚙️) on any camera
2. Enter the RTSP URL in the format: `rtsp://username:password@ip:port/stream`
3. Select stream type (RTSP, HLS, or MJPEG)
4. Click "Save & Connect"

### Database Configuration
RTSP URLs are stored in the database and can be updated via API:
```bash
curl -X POST http://localhost:3000/api/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "cameraId": "CAM001",
    "name": "Main Entrance",
    "location": "Building A",
    "rtspUrl": "rtsp://admin:password@192.168.1.100:554/stream1",
    "streamType": "RTSP"
  }'
```

## Network Requirements

### Firewall Configuration
Open these ports:
- **RTSP**: 554 (TCP)
- **HLS**: 8080 (HTTP)
- **WebRTC**: 8080-8090 (UDP/TCP)

### Bandwidth Considerations
- **1080p@30fps**: ~4-8 Mbps per camera
- **720p@30fps**: ~2-4 Mbps per camera
- **Multiple cameras**: Ensure sufficient upstream bandwidth

## Troubleshooting

### Common Issues

#### 1. "Connection Failed"
- Check RTSP URL format
- Verify camera credentials
- Ensure camera is accessible from server

#### 2. "Stream Not Loading"
- Check RTSP proxy server status
- Verify port forwarding
- Check firewall settings

#### 3. "Authentication Failed"
- Verify username/password
- Check camera user permissions
- Some cameras require special user for streaming

#### 4. "No Video"
- Check video codec compatibility
- Verify resolution settings
- Try different stream path

### Debug Commands
```bash
# Test RTSP connection
ffplay rtsp://admin:password@192.168.1.100:554/stream1

# Check network connectivity
telnet 192.168.1.100 554

# Monitor RTSP proxy logs
tail -f /var/log/mediamtx.log
```

## Security Considerations

### Authentication
- Use strong passwords for camera accounts
- Create dedicated streaming user accounts
- Change default passwords

### Network Security
- Use VPN for remote access
- Implement firewall rules
- Consider HTTPS for web interface

### Camera Security
- Disable unused services
- Update camera firmware
- Change default ports if possible

## Production Deployment

### Load Balancing
For multiple cameras, consider:
- Multiple RTSP proxy instances
- Load balancer for HLS streams
- CDN for HLS distribution

### Recording
- Implement NVR functionality
- Configure motion detection
- Set up storage management

### Monitoring
- Monitor stream health
- Alert on connection failures
- Log stream statistics

## API Endpoints

### Stream Configuration
- `GET /api/streams/[cameraId]` - Get stream config
- `POST /api/streams/[cameraId]` - Update stream config
- `GET /api/cameras` - List all cameras with RTSP URLs

### Stream URLs
- HLS: `http://localhost:8888/[cameraId]/playlist.m3u8`
- WebRTC: `ws://localhost:8889/[cameraId]/ws`
- RTSP: `rtsp://localhost:8554/[cameraId]`

This setup provides a professional RTSP-based CCTV monitoring system with real-time streaming capabilities.