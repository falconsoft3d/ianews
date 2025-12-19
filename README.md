# IA News - Periódico Digital

Periódico digital con generación de contenido mediante Inteligencia Artificial usando Ollama.

## Características

- ✨ Generación automática de artículos con IA local (Ollama)
- 📰 Diseño de periódico tradicional
- 🎨 Categorías personalizables con colores
- 📊 Dashboard de administración
- 🔖 Sistema de etiquetas
- 👁️ Contador de visitas
- ⭐ Artículos destacados

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (fácil de cambiar a PostgreSQL/MySQL)
- **Ollama** - Motor de IA local
- **Tailwind CSS** - Estilos (implícito en el diseño)

## Requisitos

- Node.js 18+
- [Ollama](https://ollama.ai) instalado y corriendo localmente
- Modelo de IA descargado (ej: `ollama pull llama2`)

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env`:
```env
DATABASE_URL="file:./dev.db"
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama2"
```

3. **Inicializar base de datos:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Crear datos de ejemplo (opcional):**
```bash
npx prisma db seed
```

## Uso

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Producción

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
ianews/
├── app/
│   ├── api/              # API Routes
│   │   ├── articles/     # CRUD artículos
│   │   ├── categories/   # CRUD categorías
│   │   └── ollama/       # Estado de Ollama
│   ├── articulo/         # Página de artículo individual
│   ├── dashboard/        # Panel de administración
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página home (periódico)
│   └── globals.css       # Estilos globales
├── lib/
│   ├── prisma.ts         # Cliente Prisma
│   ├── ollama.ts         # Servicio Ollama/IA
│   └── utils.ts          # Utilidades
├── prisma/
│   └── schema.prisma     # Esquema de base de datos
└── package.json
```

## Uso del Dashboard

1. Accede a `/dashboard`
2. **Crear Categorías:** Define temas con nombre, descripción y color
3. **Generar Artículos:** 
   - Escribe un tema
   - Selecciona categoría
   - Elige el tono (informativo, formal, casual, técnico)
   - Haz clic en "Generar Artículo"
4. **Gestionar Artículos:**
   - Publicar/Ocultar
   - Marcar como destacado
   - Eliminar

## Modelos de Base de Datos

### Category
- Categorías de artículos (Tecnología, Deportes, etc.)
- Color personalizable para identificación visual

### Article
- Título, resumen y contenido completo
- Relación con categoría
- Tags (etiquetas)
- Estado de publicación
- Contador de visitas
- Indicador de generación (IA o manual)

### Config
- Configuraciones generales del sitio

## Personalización

### Cambiar modelo de Ollama

En `.env`:
```env
OLLAMA_MODEL="mistral"  # o cualquier otro modelo
```

### Cambiar base de datos a PostgreSQL

1. En `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. En `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ianews"
```

3. Ejecuta:
```bash
npx prisma migrate dev
```

## Comandos Útiles

```bash
# Ver base de datos
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Generar cliente Prisma
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion
```

## Próximas Mejoras

- [ ] Imágenes generadas con IA
- [ ] Editor de artículos manual
- [ ] Sistema de comentarios
- [ ] Newsletter
- [ ] Búsqueda de artículos
- [ ] RSS Feed
- [ ] Categorías por página
- [ ] Modo oscuro
- [ ] SEO mejorado
- [ ] Analytics

## Licencia

MIT

## Autor

Marlon Falcon
