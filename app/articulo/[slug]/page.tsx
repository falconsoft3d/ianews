import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (article) {
    // Incrementar contador de visitas
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
  }

  return article
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  const tags = JSON.parse(article.tags) as string[]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-black text-white py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-red-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button className="text-white text-2xl md:hidden">☰</button>
            <Link href="/" className="text-white text-3xl font-black tracking-wider">
              IA NEWS
            </Link>
            <button className="text-white text-xl">🔍</button>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
            <Link href="/" className="text-white text-sm font-semibold px-3 py-1 hover:bg-red-700 rounded whitespace-nowrap">
              Inicio
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="text-white text-sm font-semibold px-3 py-1 hover:bg-red-700 rounded whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-300 p-8">
          <span
            className="inline-block px-3 py-1 text-xs font-bold text-white mb-4"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name.toUpperCase()}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <span>{formatDate(article.createdAt)}</span>
            <span>•</span>
            <span>{article.viewCount} lecturas</span>
            <span>•</span>
            <span>
              {article.generatedBy === 'ai'
                ? 'Generado con IA'
                : 'Escrito manualmente'}
            </span>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {article.summary}
            </p>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {article.content}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-black mb-4">IA NEWS</h3>
              <p className="text-sm text-gray-400">
                Noticias generadas con inteligencia artificial. Mantente informado con contenido actualizado.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Categorías</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/categoria/${cat.slug}`} className="hover:text-white">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Síguenos</h4>
              <div className="flex gap-4 text-2xl">
                <span className="hover:text-gray-400 cursor-pointer">𝕏</span>
                <span className="hover:text-gray-400 cursor-pointer">📘</span>
                <span className="hover:text-gray-400 cursor-pointer">📷</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-800">
            © {new Date().getFullYear()} IA News. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
