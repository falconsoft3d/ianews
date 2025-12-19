import { NextResponse } from 'next/server'
import { Ollama } from 'ollama'

export async function POST(request: Request) {
  try {
    const { model, prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'El prompt es requerido' },
        { status: 400 }
      )
    }

    const ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    })

    const modelToUse = model || process.env.OLLAMA_MODEL || 'llama2'

    const response = await ollama.generate({
      model: modelToUse,
      prompt,
      stream: false,
    })

    return NextResponse.json({
      success: true,
      response: response.response,
      model: modelToUse,
      duration: response.total_duration,
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Error al generar respuesta. Verifica que el modelo esté disponible.',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
