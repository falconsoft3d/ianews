import { Ollama } from 'ollama'

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434',
})

export interface GenerateArticleParams {
  topic: string
  category: string
  language?: string
  tone?: string
}

export interface GeneratedArticle {
  title: string
  summary: string
  content: string
  tags: string[]
}

export async function generateArticle(
  params: GenerateArticleParams
): Promise<GeneratedArticle> {
  const { topic, category, language = 'español', tone = 'informativo' } = params

  const model = process.env.OLLAMA_MODEL || 'llama2'

  try {
    // Generar título
    const titlePrompt = `Genera un título atractivo y periodístico en ${language} para un artículo sobre: ${topic}. 
    Categoría: ${category}. Solo responde con el título, sin comillas ni explicaciones.`

    const titleResponse = await ollama.generate({
      model,
      prompt: titlePrompt,
      stream: false,
    })

    const title = titleResponse.response.trim()

    // Generar resumen
    const summaryPrompt = `Escribe un resumen de 2-3 oraciones en ${language} para un artículo periodístico sobre: ${topic}. 
    Título: ${title}. Tono: ${tone}. Solo responde con el resumen.`

    const summaryResponse = await ollama.generate({
      model,
      prompt: summaryPrompt,
      stream: false,
    })

    const summary = summaryResponse.response.trim()

    // Generar contenido completo
    const contentPrompt = `Escribe un artículo periodístico completo en ${language} sobre: ${topic}.
    Título: ${title}
    Resumen: ${summary}
    Categoría: ${category}
    Tono: ${tone}
    
    El artículo debe tener:
    - Introducción clara
    - Desarrollo con varios párrafos
    - Conclusión
    - Estilo periodístico profesional
    
    Escribe solo el contenido del artículo, sin incluir título ni resumen.`

    const contentResponse = await ollama.generate({
      model,
      prompt: contentPrompt,
      stream: false,
    })

    const content = contentResponse.response.trim()

    // Generar tags
    const tagsPrompt = `Genera 5 tags relevantes en ${language} para un artículo sobre: ${topic}. 
    Categoría: ${category}. Responde solo con las palabras separadas por comas, sin numeración.`

    const tagsResponse = await ollama.generate({
      model,
      prompt: tagsPrompt,
      stream: false,
    })

    const tags = tagsResponse.response
      .trim()
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, 5)

    return {
      title,
      summary,
      content,
      tags,
    }
  } catch (error) {
    console.error('Error generating article with Ollama:', error)
    throw new Error('No se pudo generar el artículo con IA')
  }
}

export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.OLLAMA_HOST || 'http://localhost:11434'}/api/tags`
    )
    return response.ok
  } catch (error) {
    return false
  }
}

export default ollama
