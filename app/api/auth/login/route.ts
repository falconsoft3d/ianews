import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Obtener credenciales de variables de entorno
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Validar credenciales
    if (username === validUsername && password === validPassword) {
      // Generar token simple
      const token = process.env.AUTH_TOKEN || 'default_secret_token_change_in_production'
      
      // Establecer cookie
      cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
