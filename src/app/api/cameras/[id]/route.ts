import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const camera = await db.camera.findUnique({
      where: { cameraId: params.id }
    })

    if (!camera) {
      return NextResponse.json(
        { success: false, error: 'Camera not found' },
        { status: 404 }
      )
    }

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
    console.error('Error fetching camera:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch camera' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, location, status, resolution, fps } = body

    const camera = await db.camera.update({
      where: { cameraId: params.id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(status && { status: status.toUpperCase() }),
        ...(resolution && { resolution }),
        ...(fps && { fps }),
        lastUpdate: new Date()
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
    console.error('Error updating camera:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update camera' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.camera.delete({
      where: { cameraId: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Camera deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting camera:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete camera' },
      { status: 500 }
    )
  }
}