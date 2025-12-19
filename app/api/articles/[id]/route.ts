import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const article = await prisma.article.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar artículo' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.article.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar artículo' }, { status: 500 })
  }
}
