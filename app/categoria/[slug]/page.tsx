import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug, active: true },
    include: {
      articles: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      },
    },
  })

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  if (!category) {
    notFound()
  }

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
                className={`text-white text-sm font-semibold px-3 py-1 hover:bg-red-700 rounded whitespace-nowrap ${cat.slug === params.slug ? 'bg-red-700' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Category Header */}
      <div 
        className="py-12 text-white" 
        style={{ backgroundColor: category.color }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg opacity-90">{category.description}</p>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {category.articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 mb-4">
              No hay artículos en esta categoría todavía
            </p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.articles.map((article) => (
              <Link
                key={article.id}
                href={`/articulo/${article.slug}`}
                className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-3 py-1 text-xs font-bold text-white rounded"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-red-600 transition line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>👁️ {article.viewCount} lecturas</span>
                    <span className="text-red-600 font-semibold group-hover:underline">
                      Leer más →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

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

export async function generateMetadata({ params }: PageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    }
  }

  return {
    title: `${category.name} - IA NEWS`,
    description: category.description || `Artículos de ${category.name}`,
  }
}
