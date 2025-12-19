import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener artículos' }, { status: 500 })
  }
}
