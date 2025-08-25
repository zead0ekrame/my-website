import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientIdParam = searchParams.get('clientId');
    const sessionId = searchParams.get('sessionId') || undefined;

    let clientId: string | null = null;
    if (clientIdParam) {
      const client = await (prisma as any).client.findFirst({
        where: {
          OR: [
            { id: clientIdParam },
            { slug: clientIdParam }
          ]
        },
        select: { id: true }
      });
      clientId = client?.id ?? null;
    }

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (sessionId) where.sessionId = sessionId;

    const agg = await (prisma as any).usageLog.aggregate({
      where,
      _sum: { promptTokens: true, completionTokens: true, totalTokens: true }
    });

    return NextResponse.json({
      promptTokens: agg._sum.promptTokens || 0,
      completionTokens: agg._sum.completionTokens || 0,
      totalTokens: agg._sum.totalTokens || 0
    });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


