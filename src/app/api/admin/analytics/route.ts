import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - جلب إحصائيات النظام
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // month, week, day
    const tenantId = searchParams.get('tenantId');

    const now = new Date();
    let startDate: Date;

    // تحديد الفترة الزمنية
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // بناء where clause
    const where: any = {
      createdAt: {
        gte: startDate,
        lte: now
      }
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    // إحصائيات عامة
    const [totalTenants, totalProjects, totalConversations, totalMessages] = await Promise.all([
      prisma.tenant.count(),
      prisma.project.count(),
      prisma.conversation.count(),
      prisma.message.count()
    ]);

    // إحصائيات النشاط
    const [activeTenants, activeProjects, recentConversations] = await Promise.all([
      prisma.tenant.count({ where: { status: 'active' } }),
      prisma.project.count({ where: { status: 'active' } }),
      prisma.conversation.count({ where })
    ]);

    // إحصائيات الاستخدام
    const usageStats = await prisma.usageDaily.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: now
        },
        ...(tenantId && { tenantId })
      },
      _sum: {
        requests: true,
        tokensOut: true
      },
      _avg: {
        requests: true,
        tokensOut: true
      }
    });

    // إحصائيات حسب الخطة
    const planStats = await prisma.tenant.groupBy({
      by: ['plan'],
      _count: { id: true }
    });

    // إحصائيات حسب القناة
    const channelStats = await prisma.conversation.groupBy({
      by: ['channel'],
      _count: { id: true }
    });

    // إحصائيات حسب الحالة
    const statusStats = await prisma.project.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // النشاط اليومي (آخر 7 أيام)
    const dailyActivity = await prisma.usageDaily.findMany({
      where: {
        date: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        requests: true,
        tokensOut: true
      }
    });

    // أفضل العملاء نشاطاً
    const topTenants = await prisma.tenant.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            users: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalTenants,
          totalProjects,
          totalConversations,
          totalMessages,
          activeTenants,
          activeProjects,
          recentConversations
        },
        usage: {
          totalRequests: usageStats._sum.requests || 0,
          totalTokens: usageStats._sum.tokensOut || 0,
          avgRequests: usageStats._avg.requests || 0,
          avgTokens: usageStats._avg.tokensOut || 0
        },
        plans: planStats.map(plan => ({
          plan: plan.plan,
          count: plan._count.id
        })),
        channels: channelStats.map(channel => ({
          channel: channel.channel,
          count: channel._count.id
        })),
        statuses: statusStats.map(status => ({
          status: status.status,
          count: status._count.id
        })),
        dailyActivity: dailyActivity.map(day => ({
          date: day.date,
          requests: day.requests,
          tokens: day.tokensOut
        })),
        topTenants: topTenants.map(tenant => ({
          id: tenant.id,
          name: tenant.name,
          plan: tenant.plan,
          createdAt: tenant.createdAt,
                  projectsCount: tenant._count.projects,
        usersCount: tenant._count.users
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
