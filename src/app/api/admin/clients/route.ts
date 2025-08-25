import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { isAdminRequest } from '../../../../lib/auth';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\u0600-\u06FF]/g, '')
    .replace(/-+/g, '-');
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
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
    
    const slug: string = (body?.slug || slugify(name)).toString();
    const exists = await prisma.client.findUnique({ where: { slug } });
    if (exists) {
      return NextResponse.json({ error: 'Slug مستخدم بالفعل' }, { status: 409 });
    }
    
    const emailExists = await prisma.client.findUnique({ where: { email: email.toLowerCase() } });
    if (emailExists) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        name,
        slug,
        email: email.toLowerCase(),
        password: hashedPassword,
        systemPrompt: body?.systemPrompt || null,
        model: body?.model || null,
        temperature: typeof body?.temperature === 'number' ? body.temperature : null,
        tokenLimitMonthly: body?.tokenLimitMonthly || 100000,
      },
    });
    
    // Don't return password
    const { password: _, ...clientWithoutPassword } = client;
    return NextResponse.json({ client: clientWithoutPassword }, { status: 201 });
  } catch (e) {
    console.error('Error creating client:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


