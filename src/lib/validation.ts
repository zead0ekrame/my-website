import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور قصيرة جداً')
});

export const clientSchema = z.object({
  name: z.string().min(2, 'الاسم قصير جداً').max(100, 'الاسم طويل جداً'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور قصيرة جداً')
});

export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, 'الرسالة فارغة').max(4000, 'الرسالة طويلة جداً')
  })).min(1, 'مطلوب رسالة واحدة على الأقل'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(4000).optional(),
  stream: z.boolean().optional(),
  system: z.string().optional(),
  clientId: z.string().optional(),
  sessionId: z.string().optional()
});
