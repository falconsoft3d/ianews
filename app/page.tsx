import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

async function getArticles() {
  return await prisma.article.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })
}

export default async function HomePage() {
  const articles = await getArticles()
  const categories = await getCategories()
  const featured = articles.find((a) => a.featured)
  const topStories = articles.slice(0, 5)
  const remainingArticles = articles.slice(5)

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

      {/* Trending Bar */}
      {topStories.length > 0 && (
        <div className="bg-gray-100 border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 overflow-x-auto">
            <span className="text-xs font-bold text-red-600 whitespace-nowrap">ÚLTIMAS NOTICIAS:</span>
            {topStories.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/articulo/${article.slug}`}
                className="text-sm text-gray-700 hover:text-red-600 whitespace-nowrap"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Featured Article */}
            {featured && (
              <article className="border-b border-gray-300 pb-6">
                <Link href={`/articulo/${featured.slug}`}>
                  <div className="bg-gray-200 h-96 mb-4 flex items-center justify-center hover:opacity-90 transition">
                    <span className="text-gray-400 text-lg">Imagen principal</span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2 py-1 text-white"
                    style={{ backgroundColor: featured.category.color }}
                  >
                    {featured.category.name.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(featured.createdAt)}</span>
                </div>
                <Link href={`/articulo/${featured.slug}`}>
                  <h1 className="text-4xl font-bold mb-3 leading-tight hover:text-red-600 transition">
                    {featured.title}
                  </h1>
                </Link>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {featured.summary}
                </p>
              </article>
            )}

            {/* Secondary Stories */}
            <div className="grid md:grid-cols-2 gap-6">
              {articles.slice(featured ? 1 : 0, featured ? 5 : 4).map((article) => (
                <article key={article.id} className="border-b border-gray-200 pb-4">
                  <Link href={`/articulo/${article.slug}`}>
                    <div className="bg-gray-200 h-48 mb-3 flex items-center justify-center hover:opacity-90 transition">
                      <span className="text-gray-400 text-sm">Imagen</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-1 text-white"
                      style={{ backgroundColor: article.category.color }}
                    >
                      {article.category.name.toUpperCase()}
                    </span>
                  </div>
                  <Link href={`/articulo/${article.slug}`}>
                    <h3 className="text-xl font-bold mb-2 leading-tight hover:text-red-600 transition">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {article.summary}
                  </p>
                </article>
              ))}
            </div>

            {/* More Stories */}
            {remainingArticles.length > 4 && (
              <div className="border-t-4 border-red-600 pt-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Más Noticias</h2>
                {remainingArticles.slice(4).map((article) => (
                  <article key={article.id} className="flex gap-4 border-b border-gray-200 pb-4">
                    <Link href={`/articulo/${article.slug}`} className="flex-shrink-0">
                      <div className="bg-gray-200 w-32 h-24 flex items-center justify-center hover:opacity-90 transition">
                        <span className="text-gray-400 text-xs">Img</span>
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 text-white"
                          style={{ backgroundColor: article.category.color }}
                        >
                          {article.category.name.toUpperCase()}
                        </span>
                      </div>
                      <Link href={`/articulo/${article.slug}`}>
                        <h4 className="font-bold mb-1 hover:text-red-600 transition leading-snug">
                          {article.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {article.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="border-t-4 border-black pt-4">
              <h2 className="text-xl font-bold mb-4">Tendencias</h2>
              <div className="space-y-4">
                {articles.slice(0, 6).map((article, idx) => (
                  <div key={article.id} className="flex gap-3 pb-4 border-b border-gray-200">
                    <span className="text-3xl font-bold text-gray-300">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 text-white"
                          style={{ backgroundColor: article.category.color }}
                        >
                          {article.category.name.toUpperCase()}
                        </span>
                      </div>
                      <Link href={`/articulo/${article.slug}`}>
                        <h4 className="font-bold text-sm leading-snug hover:text-red-600 transition">
                          {article.title}
                        </h4>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-gray-100 p-4 border-t-4 border-red-600">
              <h3 className="text-lg font-bold mb-3">Categorías</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categoria/${cat.slug}`}
                    className="block px-3 py-2 hover:bg-white transition text-sm font-semibold"
                    style={{ borderLeft: `4px solid ${cat.color}` }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">
              No hay artículos publicados aún.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
            >
              Ir al Dashboard
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-6">
            <div>
              <h4 className="font-bold mb-3">IA NEWS</h4>
              <p className="text-sm text-gray-400">Noticias generadas con inteligencia artificial</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Categorías</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(0, 5).map((cat) => (
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
