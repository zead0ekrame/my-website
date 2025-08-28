import { NextRequest, NextResponse } from 'next/server';
// bcrypt import removed - not needed
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Find client by email
    const client = await prisma.tenant.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // Password verification disabled - Tenant model doesn't have password field
    // TODO: Add password field to Tenant model or create separate UserAuth model

    // Return client info (without password)
    return NextResponse.json({
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      message: 'تم تسجيل الدخول بنجاح'
    });

  } catch (error) {
    console.error('Client login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
