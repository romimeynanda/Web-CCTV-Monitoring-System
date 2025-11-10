
# 🎥 CCTV Monitoring System

<div align="center">
  <img src="https://img.shields.io/badge/CCTV-Monitoring%20System-blue?style=for-the-badge" alt="CCTV Monitoring System">
  <img src="https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-purple?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js" alt="Next.js">
</div>

<div align="center">
  <h3>Professional Web-Based Surveillance with RTSP Support</h3>
  <p>Real-time surveillance system with multi-protocol streaming support, built for professional security monitoring.</p>
</div>

<div align="center">
  <a href="http://localhost:3000">
    <img src="https://img.shields.io/badge/Demo-Live-orange?style=for-the-badge" alt="Demo">
  </a>
  <a href="#documentation">
    <img src="https://img.shields.io/badge/Documentation-Read%20Me-blue?style=for-the-badge" alt="Documentation">
  </a>
  <a href="https://github.com/romimeynanda/Web-CCTV-Monitoring-System/issues">
    <img src="https://img.shields.io/badge/Report%20Bug-Fix%20Me-red?style=for-the-badge" alt="Report Bug">
  </a>
  <a href="https://raw.githubusercontent.com/romimeynanda/Web-CCTV-Monitoring-System/main/README.md">
    <img src="https://img.shields.io/badge/Download-Now-brightgreen?style=for-the-badge&logo=github" alt="Download">
  </a>
</div>

---

## 📋 Table of Contents

- [📊 Project Statistics](#-project-statistics)
- [📸 Preview](#-preview)
- [🚀 Quick Start](#-quick-start)
- [✨ Key Features](#-key-features)
- [🛠️ Technical Stack](#️-technical-stack)
- [🔌 RTSP Setup](#-rtsp-setup)
- [📚 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [🚀 Deployment](#-deployment)
- [🛡️ Security Features](#️-security-features)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [📞 Support](#-support)
- [📥 Download Options](#-download-options)

---

## 📊 Project Statistics

| Feature | Count | Status |
|----------|--------|--------|
| 📹 Camera Support | 12+ | ✅ Active |
| 🌐 Stream Protocols | 3 | ✅ RTSP, HLS, MJPEG |
| 📱 Responsive | 100% | ✅ Mobile-First |
| 🔧 Grid Layouts | 4 | ✅ 1×1, 2×2, 3×3, 4×4 |
| 🛡️ Security | Enterprise | ✅ Production Ready |

---

## 📸 Preview

<div align="center">
  <img src="https://z-cdn-media.chatglm.cn/files/3551013d-2d7c-44d8-8cf7-674e6b68a30c_preview-chat-7e91a6c7-bb9f-4427-a9aa-f96a94b5c801.space.z.ai_.png?auth_key=1862745116-c6e45060bde844e2920507e2f9ee045b-0-016153badb49cc47626f24b8dc829b38" alt="CCTV Monitoring System dashboard with a 4x4 camera grid and a status sidebar.">
  <p><i>Main dashboard view showing the camera grid, sidebar list, and real-time system status.</i></p>
</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **SQLite** (default) or **PostgreSQL/MySQL** for production

### Installation

```bash
# Clone the repository
git clone https://github.com/romimeynanda/Web-CCTV-Monitoring-System.git
cd Web-CCTV-Monitoring-System

# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

🎉 **Open your browser and navigate to [http://localhost:3000](http://localhost:3000)**

---

## ✨ Key Features

### 🎥 Multi-Protocol Streaming

- **RTSP Protocol** - Direct connection to CCTV cameras
- **HLS Streaming** - HTTP Live Streaming for browser compatibility
- **MJPEG Streaming** - Motion JPEG for simple web streaming
- **Auto-detection** - Smart protocol selection

### 🎛️ Advanced Interface

- **Flexible Grid Layouts** - 1×1, 2×2, 3×3, 4×4 options
- **Real-time Search** - Filter cameras by name, location, status
- **Interactive Sidebar** - Mobile-responsive camera management
- **Video Controls** - Play, pause, mute, fullscreen support

### 🔌 RTSP Integration

- **Built-in Configuration** - RTSP URL setup panel
- **Authentication Support** - Username/password authentication
- **Camera Compatibility** - Hikvision, Dahua, Axis, ONVIF
- **Connection Management** - Auto-reconnect and error handling

### 📱 Responsive Design

- **Mobile-First** - Touch-friendly controls
- **Adaptive Layout** - Works on all screen sizes
- **Progressive Enhancement** - Core features work everywhere

---

## 🛠️ Technical Stack

| Technology | Purpose | Version |
|-------------|----------|----------|
| **Next.js** | Full-stack Framework | 15 |
| **React** | UI Library | 18 |
| **TypeScript** | Type Safety | 5 |
| **Tailwind CSS** | Styling | 4 |
| **Prisma** | Database ORM | Latest |
| **SQLite** | Database | 3 |
| **HLS.js** | Video Streaming | Latest |
| **Socket.io** | Real-time Communication | Latest |
| **shadcn/ui** | UI Components | Latest |

---

## 🔌 RTSP Setup

### Supported Camera Formats

```bash
# Hikvision Cameras
rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101

# Dahua Cameras  
rtsp://admin:password@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0

# Axis Cameras
rtsp://root:password@192.168.1.100:554/axis-media/media.amp

# Generic ONVIF
rtsp://admin:password@192.168.1.100:554/live
```

### RTSP Proxy Server (Production)

For production deployment, use **MediaMTX** (recommended):

```bash
# Docker Setup
docker run -d \
  -p 8554:8554 \
  -p 8888:8888 \
  -p 8889:8889 \
  aler9/rtsp-simple-server

# Configuration (mediamtx.yml)
paths:
  CAM001:
    source: rtsp://admin:password@192.168.1.101:554/stream1
    runOnDemand: yes
  CAM002:
    source: rtsp://admin:password@192.168.1.102:554/live
    runOnDemand: yes
```

---

## 📚 API Documentation

### Camera Management

```bash
# Get all cameras
GET /api/cameras

# Response
{
  "success": true,
  "data": [
    {
      "id": "CAM001",
      "name": "Lobby Utama",
      "location": "Lantai 1",
      "status": "online",
      "rtspUrl": "rtsp://admin:password@192.168.1.101:554/stream1",
      "streamType": "RTSP"
    }
  ]
}

# Add new camera
POST /api/cameras
{
  "cameraId": "CAM001",
  "name": "Main Entrance",
  "location": "Building A",
  "rtspUrl": "rtsp://admin:password@192.168.1.100:554/stream1",
  "streamType": "RTSP"
}

# Update camera
PUT /api/cameras/[id]
{
  "name": "Updated Name",
  "status": "ONLINE"
}

# Delete camera
DELETE /api/cameras/[id]
```

### Stream Configuration

```bash
# Get stream config
GET /api/streams/[cameraId]

# Update stream config
POST /api/streams/[cameraId]
{
  "rtspUrl": "rtsp://admin:password@192.168.1.100:554/stream1",
  "streamType": "RTSP"
}
```

---

## 🗄️ Database Schema

```prisma
model Camera {
  id          String   @id @default(cuid())
  cameraId    String   @unique // CAM001, CAM002, etc
  name        String
  location    String
  status      CameraStatus @default(OFFLINE)
  resolution  String   @default("1920x1080")
  fps         Int      @default(30)
  rtspUrl     String?  // RTSP stream URL
  streamType  StreamType @default(HLS) // HLS, RTSP, MJPEG
  lastUpdate  DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum CameraStatus {
  ONLINE
  OFFLINE
  RECORDING
}

enum StreamType {
  HLS
  RTSP
  MJPEG
}
```

---

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t cctv-monitoring .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data cctv-monitoring
```

### Production Setup

1.  **Environment Variables**

    ```bash
       DATABASE_URL="postgresql://user:password@localhost:5432/cctv"
       RTSP_PROXY_HOST="localhost"
       RTSP_PROXY_PORT="8080"
       NODE_ENV="production"
    ```

2.  **RTSP Proxy Server**
    - Install MediaMTX or FFmpeg
    - Configure camera sources
    - Set up port forwarding

3.  **Web Server**
    - Nginx reverse proxy
    - SSL certificates
    - Firewall configuration

4.  **Monitoring**
    - Application logging
    - Performance monitoring
    - Health checks

---

## 🛡️ Security Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | RTSP credential management |
| **👥 Access Control** | Role-based permissions |
| **📝 Audit Logs** | Complete access logging |
| **🔒 Encryption** | Secure data transmission |
| **🛡️ Input Validation** | XSS and SQL injection protection |

---

## 🐛 Troubleshooting

### Common Issues

```bash
# Camera Connection Failed
✅ Check RTSP URL format
✅ Verify camera credentials  
✅ Test network connectivity
✅ Check firewall settings

# Stream Not Loading
✅ Verify RTSP proxy server status
✅ Check port forwarding
✅ Confirm stream path

# Performance Issues
✅ Reduce simultaneous streams
✅ Lower video quality settings
✅ Check bandwidth capacity
```

### Debug Commands

```bash
# Test RTSP connection
ffplay rtsp://admin:password@192.168.1.100:554/stream1

# Check network connectivity
telnet 192.168.1.100 554

# Monitor application logs
npm run dev 2>&1 | tee debug.log
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  **Fork** the repository
2.  **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3.  **Commit** your changes (`git commit -m 'Add amazing feature'`)
4.  **Push** to the branch (`git push origin feature/amazing-feature`)
5.  **Open** a Pull Request

### Development Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use ESLint and Prettier formatting
- ✅ Write tests for new features
- ✅ Update documentation
- ✅ Follow conventional commit messages

### Code Style

```typescript
// Use interfaces for type safety
interface CameraConfig {
  id: string;
  name: string;
  rtspUrl?: string;
}

// Use async/await for API calls
const fetchCameras = async (): Promise<Camera[]> => {
  const response = await fetch('/api/cameras');
  return response.json();
};
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

| Library | License |
|----------|----------|
| Next.js | MIT |
| React | MIT |
| Tailwind CSS | MIT |
| Prisma | Apache-2.0 |
| HLS.js | Apache-2.0 |

---

## 🙏 Acknowledgments

- **Next.js Team** - Excellent framework
- **Prisma Team** - Amazing ORM
- **shadcn/ui** - Beautiful components
- **HLS.js** - Robust streaming library
- **MediaMTX** - RTSP proxy solution

---

## 📞 Support

- 📧 **Email**: [romimeynanda@smkppnsembawa.sch.id](mailto:romimeynanda@smkppnsembawa.sch.id)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/romimeynanda/Web-CCTV-Monitoring-System/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/romimeynanda/Web-CCTV-Monitoring-System/issues)
- 📖 **Documentation**: [Wiki](https://github.com/romimeynanda/Web-CCTV-Monitoring-System/wiki)

---

## 📥 Download Options

### 📄 Markdown Version

- **Direct Download**: [README.md](https://raw.githubusercontent.com/romimeynanda/Web-CCTV-Monitoring-System/main/README.md)
- **View Online**: [GitHub Repository](https://github.com/romimeynanda/Web-CCTV-Monitoring-System/blob/main/README.md)

### 🌐 HTML Version

- **HTML README**: [README.html](https://raw.githubusercontent.com/romimeynanda/Web-CCTV-Monitoring-System/main/README.html)
- **Interactive Demo**: [GitHub Pages](https://romimeynanda.github.io/Web-CCTV-Monitoring-System/)

### 📦 Source Code

- **Clone Repository**:
    ```bash
      git clone https://github.com/romimeynanda/Web-CCTV-Monitoring-System.git
    ```
- **Download ZIP**: [Download ZIP](https://github.com/romimeynanda/Web-CCTV-Monitoring-System/archive/refs/heads/main.zip)

---

<div align="center">
  <h3>⭐ Star this repository if it helped you!</h3>
  <p>Made with ❤️ by <a href="https://github.com/romimeynanda">Romi Meynanda Syahputra</a></p>
  
  <a href="https://github.com/romimeynanda/Web-CCTV-Monitoring-System">
    <img src="https://img.shields.io/github/stars/romimeynanda/Web-CCTV-Monitoring-System?style=social" alt="GitHub stars">
  </a>
  <a href="https://github.com/romimeynanda/Web-CCTV-Monitoring-System">
    <img src="https://img.shields.io/github/forks/romimeynanda/Web-CCTV-Monitoring-System?style=social" alt="GitHub forks">
  </a>
  <a href="https://github.com/romimeynanda/Web-CCTV-Monitoring-System/issues">
    <img src="https://img.shields.io/github/issues/romimeynanda/Web-CCTV-Monitoring-System" alt="GitHub issues">
  </a>
  <a href="https://github.com/romimeynanda/Web-CCTV-Monitoring-System/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/romimeynanda/Web-CCTV-Monitoring-System" alt="GitHub license">
  </a>
</div>
```
