import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || '#3B82F6',
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}
