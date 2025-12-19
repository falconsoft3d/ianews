import { NextResponse } from 'next/server'
import { Ollama } from 'ollama'

export async function GET() {
  try {
    const ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    })

    const models = await ollama.list()
    
    return NextResponse.json({
      available: true,
      models: models.models.map((m: any) => ({
        name: m.name,
        size: m.size,
        modified: m.modified_at,
      })),
      currentModel: process.env.OLLAMA_MODEL || 'llama2',
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    })
  } catch (error) {
    return NextResponse.json({
      available: false,
      error: 'No se pudo conectar con Ollama. Asegúrate de que esté corriendo.',
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    })
  }
}
