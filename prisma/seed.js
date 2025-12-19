const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando base de datos...')

  // Crear categorías
  const tecnologia = await prisma.category.upsert({
    where: { slug: 'tecnologia' },
    update: {},
    create: {
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Noticias sobre tecnología e innovación',
      color: '#3B82F6',
    },
  })

  const ciencia = await prisma.category.upsert({
    where: { slug: 'ciencia' },
    update: {},
    create: {
      name: 'Ciencia',
      slug: 'ciencia',
      description: 'Descubrimientos y avances científicos',
      color: '#8B5CF6',
    },
  })

  const deportes = await prisma.category.upsert({
    where: { slug: 'deportes' },
    update: {},
    create: {
      name: 'Deportes',
      slug: 'deportes',
      description: 'Noticias deportivas',
      color: '#EF4444',
    },
  })

  const cultura = await prisma.category.upsert({
    where: { slug: 'cultura' },
    update: {},
    create: {
      name: 'Cultura',
      slug: 'cultura',
      description: 'Arte, música y entretenimiento',
      color: '#F59E0B',
    },
  })

  console.log('✓ Categorías creadas')

  // Crear artículo de ejemplo
  await prisma.article.upsert({
    where: { slug: 'bienvenido-a-ia-news' },
    update: {},
    create: {
      title: 'Bienvenido a IA News',
      slug: 'bienvenido-a-ia-news',
      summary:
        'IA News es tu nuevo periódico digital con contenido generado por inteligencia artificial. Descubre cómo funciona y qué puedes hacer con esta plataforma.',
      content: `Este es un periódico digital innovador que utiliza inteligencia artificial para generar contenido de calidad. 

Con IA News, puedes:

1. Generar artículos automáticamente sobre cualquier tema que te interese
2. Organizar el contenido en categorías personalizables
3. Gestionar todo desde un dashboard intuitivo
4. Publicar y destacar los artículos más importantes

La plataforma está construida con tecnologías modernas como Next.js, Prisma y Ollama, permitiendo una experiencia fluida y potente.

Para comenzar, visita el dashboard y crea tu primera categoría. Luego, genera un artículo sobre cualquier tema que te apasione. La IA se encargará de crear contenido relevante y bien estructurado.

¡Empieza a explorar las posibilidades del periodismo asistido por IA!`,
      tags: JSON.stringify([
        'bienvenida',
        'tutorial',
        'inteligencia artificial',
        'periodismo',
      ]),
      categoryId: tecnologia.id,
      published: true,
      featured: true,
      viewCount: 0,
      generatedBy: 'manual',
    },
  })

  console.log('✓ Artículo de ejemplo creado')
  console.log('✨ ¡Base de datos lista!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
