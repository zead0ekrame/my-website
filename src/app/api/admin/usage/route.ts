import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { isAdminRequest } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const month = url.searchParams.get('month'); // YYYY-MM
  const clientIdParam = url.searchParams.get('clientId');
  const sessionSearch = url.searchParams.get('session');
  const whereAny: any = {};
  let monthStart: Date | undefined;
  let monthEnd: Date | undefined;
  if (month) {
    const [y, m] = month.split('-').map(Number);
    monthStart = new Date(y, (m || 1) - 1, 1);
    monthEnd = new Date(y, (m || 1), 1);
  }
  if (monthStart && monthEnd) {
    whereAny.createdAt = { gte: monthStart, lt: monthEnd };
  }

  // Aggregate by client
  const baseClientWhere: any = {};
  if (clientIdParam) {
    // Allow passing slug or id
    const found = await (prisma as any).client.findFirst({
      where: { OR: [{ id: clientIdParam }, { slug: clientIdParam }] },
      select: { id: true, name: true, slug: true }
    });
    if (!found) {
      return NextResponse.json({ month: month || null, totalTokens: 0, clients: [] });
    }
    const clients = [found];
    const results: any[] = [];
    const where = { ...whereAny, clientId: found.id } as any;
    if (sessionSearch) {
      where.sessionId = { contains: sessionSearch };
    }
    const agg = await (prisma as any).usageLog.aggregate({ where, _sum: { promptTokens: true, completionTokens: true, totalTokens: true } });
    const total = agg._sum.totalTokens || 0;
    const sessions = await (prisma as any).usageLog.groupBy({ by: ['sessionId'], where, _sum: { totalTokens: true }, orderBy: { _sum: { totalTokens: 'desc' } } });
    results.push({ client: found, totalTokens: total, sessions });
    const globalAgg = await (prisma as any).usageLog.aggregate({ where: whereAny, _sum: { totalTokens: true } });
    return NextResponse.json({ month: month || null, totalTokens: globalAgg._sum.totalTokens || 0, clients: results });
  }

  const clients = await (prisma as any).client.findMany({ select: { id: true, name: true, slug: true } });
  const results: any[] = [];
  for (const c of clients) {
    const where = { ...whereAny, clientId: c.id };
    if (sessionSearch) {
      (where as any).sessionId = { contains: sessionSearch };
    }
    const agg = await (prisma as any).usageLog.aggregate({ where, _sum: { promptTokens: true, completionTokens: true, totalTokens: true } });
    const total = agg._sum.totalTokens || 0;
    // sessions breakdown
    const sessions = await (prisma as any).usageLog.groupBy({ by: ['sessionId'], where, _sum: { totalTokens: true }, orderBy: { _sum: { totalTokens: 'desc' } } });
    results.push({ client: c, totalTokens: total, sessions });
  }

  // Global totals
  const globalAgg = await (prisma as any).usageLog.aggregate({ where: whereAny, _sum: { totalTokens: true } });

  return NextResponse.json({
    month: month || null,
    totalTokens: globalAgg._sum.totalTokens || 0,
    clients: results
  });
}


