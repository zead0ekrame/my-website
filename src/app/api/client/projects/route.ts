import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - جلب مشاريع العميل
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'معرف العميل مطلوب' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // بناء query
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    // جلب المشاريع مع العد
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              chatflows: true,
              conversations: true
            }
          },
          chatflows: {
            select: {
              id: true,
              name: true,
              type: true,
              status: true
            }
          },
          conversations: {
            select: {
              id: true,
              channel: true,
              status: true,
              updatedAt: true
            },
            orderBy: { updatedAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.project.count({ where })
    ]);

    // حساب الإحصائيات
    const stats = await prisma.project.aggregate({
      where: { tenantId },
      _count: { id: true },
      _sum: { 
        conversations: { _count: true }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map(project => ({
          ...project,
          chatflowsCount: project._count.chatflows,
          conversationsCount: project._count.conversations,
          lastActivity: project.conversations[0]?.updatedAt || project.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalProjects: total,
          activeProjects: projects.filter(p => p.status === 'active').length,
          totalConversations: stats._sum.conversations || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المشاريع' },
      { status: 500 }
    );
  }
}

// POST - إنشاء مشروع جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, tenantId, templateType } = body;

    // التحقق من البيانات
    if (!name || !tenantId) {
      return NextResponse.json(
        { success: false, error: 'الاسم ومعرف العميل مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من وجود العميل
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    // إنشاء المشروع
    const project = await prisma.project.create({
      data: {
        name,
        description: description || '',
        tenantId,
        status: 'active',
        type: templateType || 'custom'
      }
    });

    // إنشاء Chatflow افتراضي إذا كان هناك template
    if (templateType) {
      await prisma.chatflow.create({
        data: {
          name: `${name}-${templateType}`,
          type: templateType,
          projectId: project.id,
          status: 'active',
          flowJson: getTemplateFlow(templateType)
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'تم إنشاء المشروع بنجاح'
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المشروع' },
      { status: 500 }
    );
  }
}

// Helper function - الحصول على قالب Flow
function getTemplateFlow(templateType: string): any {
  const templates: Record<string, any> = {
    'support': {
      name: 'Support Bot',
      description: 'بوت دعم فني ذكي',
      nodes: [],
      edges: []
    },
    'sales': {
      name: 'Sales Bot',
      description: 'بوت مبيعات متقدم',
      nodes: [],
      edges: []
    },
    'faq': {
      name: 'FAQ Bot',
      description: 'بوت الأسئلة الشائعة',
      nodes: [],
      edges: []
    }
  };

  return templates[templateType] || templates['support'];
}
