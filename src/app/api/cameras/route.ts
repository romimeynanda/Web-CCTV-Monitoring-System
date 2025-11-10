import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const cameras = await db.camera.findMany({
      orderBy: {
        cameraId: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: cameras.map(camera => ({
        id: camera.cameraId,
        name: camera.name,
        location: camera.location,
        status: camera.status.toLowerCase(),
        lastUpdate: camera.lastUpdate.toISOString(),
        resolution: camera.resolution,
        fps: camera.fps,
        rtspUrl: camera.rtspUrl,
        streamType: camera.streamType
      }))
    })
  } catch (error) {
    console.error('Error fetching cameras:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cameras' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cameraId, name, location, status = 'OFFLINE', resolution = '1920x1080', fps = 30 } = body

    // Check if camera with cameraId already exists
    const existingCamera = await db.camera.findUnique({
      where: { cameraId }
    })

    if (existingCamera) {
      return NextResponse.json(
        { success: false, error: 'Camera with this ID already exists' },
        { status: 400 }
      )
    }

    const camera = await db.camera.create({
      data: {
        cameraId,
        name,
        location,
        status: status.toUpperCase(),
        resolution,
        fps
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: camera.cameraId,
        name: camera.name,
        location: camera.location,
        status: camera.status.toLowerCase(),
        lastUpdate: camera.lastUpdate.toISOString(),
        resolution: camera.resolution,
        fps: camera.fps
      }
    })
  } catch (error) {
    console.error('Error creating camera:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create camera' },
      { status: 500 }
    )
  }
}