import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - جلب جميع العملاء
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';

    const skip = (page - 1) * limit;

    // بناء query
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (plan) {
      where.plan = plan;
    }

    // جلب العملاء مع العد
    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              projects: true,
              users: true
            }
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tenant.count({ where })
    ]);

    // حساب الإحصائيات
    const stats = await prisma.tenant.aggregate({
      where: { status: 'active' },
      _count: { id: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        tenants: tenants.map(tenant => ({
          ...tenant,
          projectsCount: tenant._count.projects,
          usersCount: tenant._count.users
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalTenants: total,
          activeTenants: stats._count.id
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب العملاء' },
      { status: 500 }
    );
  }
}

// POST - إنشاء عميل جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, plan, companySize, industry } = body;

    // التحقق من البيانات
    if (!name || !email || !plan) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    const existingTenant = await prisma.tenant.findUnique({
      where: { email }
    });

    if (existingTenant) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء العميل
    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        plan,
        status: 'active'
      }
    });

    // إنشاء مستخدم افتراضي للعميل
    await prisma.user.create({
      data: {
        email,
        name: name,
        role: 'admin',
        tenantId: tenant.id
      }
    });

    return NextResponse.json({
      success: true,
      data: tenant,
      message: 'تم إنشاء العميل بنجاح'
    });

  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء العميل' },
      { status: 500 }
    );
  }
}

// Helper function removed - not needed
