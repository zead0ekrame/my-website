import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../../generated/prisma';

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
    const client = await prisma.client.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, client.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      );
    }

    // Return client info (without password)
    return NextResponse.json({
      clientId: client.id,
      clientName: client.name,
      clientSlug: client.slug,
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
