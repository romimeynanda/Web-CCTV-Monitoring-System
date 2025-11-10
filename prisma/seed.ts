import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cameras = [
  { 
    cameraId: 'CAM001', 
    name: 'Lobby Utama', 
    location: 'Lantai 1', 
    status: 'ONLINE', 
    resolution: '1920x1080', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.101:554/stream1',
    streamType: 'RTSP'
  },
  { 
    cameraId: 'CAM002', 
    name: 'Parkir Utara', 
    location: 'Area Parkir', 
    status: 'RECORDING', 
    resolution: '1920x1080', 
    fps: 25,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.102:554/live',
    streamType: 'HLS'
  },
  { 
    cameraId: 'CAM003', 
    name: 'Ruang Server', 
    location: 'Lantai 2', 
    status: 'ONLINE', 
    resolution: '1280x720', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.103:554/stream',
    streamType: 'RTSP'
  },
  { 
    cameraId: 'CAM004', 
    name: 'Cafeteria', 
    location: 'Lantai 1', 
    status: 'ONLINE', 
    resolution: '1920x1080', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.104:554/live',
    streamType: 'MJPEG'
  },
  { 
    cameraId: 'CAM005', 
    name: 'Ruang Meeting A', 
    location: 'Lantai 3', 
    status: 'OFFLINE', 
    resolution: '1280x720', 
    fps: 25,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.105:554/stream1',
    streamType: 'RTSP'
  },
  { 
    cameraId: 'CAM006', 
    name: 'Ruang Meeting B', 
    location: 'Lantai 3', 
    status: 'ONLINE', 
    resolution: '1920x1080', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.106:554/live',
    streamType: 'HLS'
  },
  { 
    cameraId: 'CAM007', 
    name: 'Lobby Belakang', 
    location: 'Lantai 1', 
    status: 'RECORDING', 
    resolution: '1920x1080', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.107:554/stream',
    streamType: 'RTSP'
  },
  { 
    cameraId: 'CAM008', 
    name: 'Gudang', 
    location: 'Basement', 
    status: 'ONLINE', 
    resolution: '1280x720', 
    fps: 25,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.108:554/live',
    streamType: 'MJPEG'
  },
  { 
    cameraId: 'CAM009', 
    name: 'Security Post', 
    location: 'Lantai 1', 
    status: 'ONLINE', 
    resolution: '1920x1080', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.109:554/stream1',
    streamType: 'RTSP'
  },
  { 
    cameraId: 'CAM010', 
    name: 'Ruang Direktur', 
    location: 'Lantai 4', 
    status: 'RECORDING', 
    resolution: '1920x1080', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.110:554/live',
    streamType: 'HLS'
  },
  { 
    cameraId: 'CAM011', 
    name: 'Parkir Selatan', 
    location: 'Area Parkir', 
    status: 'ONLINE', 
    resolution: '1920x1080', 
    fps: 25,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.111:554/stream',
    streamType: 'RTSP'
  },
  { 
    cameraId: 'CAM012', 
    name: 'Emergency Exit', 
    location: 'Setiap Lantai', 
    status: 'ONLINE', 
    resolution: '1280x720', 
    fps: 30,
    rtspUrl: 'rtsp://admin:admin123@192.168.1.112:554/live',
    streamType: 'MJPEG'
  }
]

async function main() {
  console.log('Start seeding...')
  
  for (const camera of cameras) {
    await prisma.camera.upsert({
      where: { cameraId: camera.cameraId },
      update: camera,
      create: camera
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })