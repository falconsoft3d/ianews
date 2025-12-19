import { NextResponse } from 'next/server'
import { checkOllamaStatus } from '@/lib/ollama'

export async function GET() {
  try {
    const available = await checkOllamaStatus()
    return NextResponse.json({ available })
  } catch (error) {
    return NextResponse.json({ available: false })
  }
}
