import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateArticle } from '@/lib/ollama'
import { slugify } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, categoryId, tone } = body

    if (!topic || !categoryId) {
      return NextResponse.json(
        { error: 'El tema y la categoría son requeridos' },
        { status: 400 }
      )
    }

    // Obtener la categoría
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    // Generar artículo con IA
    const generated = await generateArticle({
      topic,
      category: category.name,
      language: 'español',
      tone: tone || 'informativo',
    })

    // Crear slug único
    let slug = slugify(generated.title)
    const existingSlug = await prisma.article.findUnique({
      where: { slug },
    })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    // Guardar en la base de datos
    const article = await prisma.article.create({
      data: {
        title: generated.title,
        slug,
        summary: generated.summary,
        content: generated.content,
        tags: JSON.stringify(generated.tags),
        categoryId,
        generatedBy: 'ai',
        published: false,
      },
      include: { category: true },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error generating article:', error)
    return NextResponse.json(
      { error: 'Error al generar artículo. Verifica que Ollama esté corriendo.' },
      { status: 500 }
    )
  }
}
