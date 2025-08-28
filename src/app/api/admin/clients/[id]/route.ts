import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { isAdminRequest } from '../../../../../lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await prisma.tenant.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data: any = {};
    if (typeof body?.name === 'string') data.name = body.name;
    if (typeof body?.slug === 'string') data.slug = body.slug;
    // هذه الحقول غير موجودة في Tenant schema
    // if (typeof body?.systemPrompt !== 'undefined') data.systemPrompt = body.systemPrompt;
    // if (typeof body?.model !== 'undefined') data.model = body.model;
    // if (typeof body?.temperature !== 'undefined') data.temperature = body.temperature;

    const tenant = await prisma.tenant.update({ where: { id: params.id }, data });
    return NextResponse.json({ tenant });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


