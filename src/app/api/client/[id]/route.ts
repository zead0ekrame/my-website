import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'معرف العميل مطلوب' },
        { status: 400 }
      );
    }

    // Find client by ID
    const client = await prisma.tenant.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'لم يتم العثور على العميل' },
        { status: 404 }
      );
    }

    return NextResponse.json({ client });

  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const body = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'معرف العميل مطلوب' },
        { status: 400 }
      );
    }

    // Update client settings
    const updatedClient = await prisma.tenant.update({
      where: { id: clientId },
      data: {
        name: body.name,
        email: body.email,
        plan: body.plan,
        status: body.status
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ client: updatedClient });

  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
