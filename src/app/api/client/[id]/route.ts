import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

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
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        systemPrompt: true,
        model: true,
        temperature: true,
        tokenLimitMonthly: true,
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
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        systemPrompt: body.systemPrompt,
        model: body.model,
        temperature: body.temperature,
        tokenLimitMonthly: body.tokenLimitMonthly
      },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        systemPrompt: true,
        model: true,
        temperature: true,
        tokenLimitMonthly: true,
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
