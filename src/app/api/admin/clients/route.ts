import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { isAdminRequest } from '../../../../lib/auth';

// slugify function removed - not needed for Tenant

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
      const clients = await prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const name: string = (body?.name || '').toString();
    const email: string = (body?.email || '').toString();
    const password: string = (body?.password || '').toString();
    
    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'اسم العميل مطلوب' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب وصحيح' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور مطلوبة (6 أحرف على الأقل)' }, { status: 400 });
    }
    
    // التحقق من عدم وجود البريد الإلكتروني
    const emailExists = await prisma.tenant.findUnique({ where: { email: email.toLowerCase() } });
    if (emailExists) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 });
    }

    // password غير مطلوب في Tenant schema

    const client = await prisma.tenant.create({
      data: {
        name,
        email: email.toLowerCase(),
        // password غير موجود في Tenant schema
        // systemPrompt غير موجود في Tenant schema
        // model غير موجود في Tenant schema
        // temperature غير موجود في Tenant schema
        // tokenLimitMonthly غير موجود في Tenant schema
      },
    });
    
    return NextResponse.json({ client }, { status: 201 });
  } catch (e) {
    console.error('Error creating client:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


