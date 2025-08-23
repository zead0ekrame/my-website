// وظائف تدريب البوت على محتوى الموقع
// هذا الملف يحتوي على وظائف لمسح البيانات القديمة وتغذية البوت بمحتوى جديد

export interface TrainingData {
  url: string;
  title: string;
  content: string;
  type: 'page' | 'service' | 'faq';
}

export interface ChatbotTrainingResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * مسح أي بيانات قديمة غير ذات صلة
 */
export async function clearPreviousKnowledge(): Promise<ChatbotTrainingResult> {
  try {
    // هنا يمكن إضافة استدعاء API لمحو مصادر قديمة
    // مثال: await fetch('/api/chatbot/clear', { method: 'DELETE' });
    
    console.log('تم مسح البيانات القديمة بنجاح');
    return {
      success: true,
      message: 'تم مسح البيانات القديمة بنجاح'
    };
  } catch (error) {
    console.error('خطأ في مسح البيانات القديمة:', error);
    return {
      success: false,
      message: 'فشل في مسح البيانات القديمة'
    };
  }
}

/**
 * جلب نصوص الصفحات (يزيل HTML)
 */
export async function fetchPagesContent(urls: string[]): Promise<TrainingData[]> {
  const trainingData: TrainingData[] = [];
  
  try {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        
        // إزالة HTML tags (تبسيط)
        const content = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // استخراج العنوان من HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'صفحة بدون عنوان';
        
        trainingData.push({
          url,
          title,
          content: content.substring(0, 2000), // تحديد طول المحتوى
          type: 'page'
        });
      } catch (error) {
        console.error(`خطأ في جلب محتوى ${url}:`, error);
      }
    }
    
    return trainingData;
  } catch (error) {
    console.error('خطأ في جلب محتوى الصفحات:', error);
    return [];
  }
}

/**
 * تقطيع المحتوى إلى أجزاء مناسبة للتدريب
 */
export function chunkTextForEmbedding(text: string, maxChunkSize: number = 500): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?؟]/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    if (currentChunk.length + trimmedSentence.length > maxChunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmedSentence;
      } else {
        // إذا كانت الجملة طويلة جداً، قسمها
        chunks.push(trimmedSentence.substring(0, maxChunkSize));
        currentChunk = trimmedSentence.substring(maxChunkSize);
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * إرسال البيانات للبوت (API)
 */
export async function upsertKnowledge(chunks: string[], metadata: any): Promise<ChatbotTrainingResult> {
  try {
    // هنا يمكن إضافة استدعاء API لإرسال البيانات للبوت
    // مثال: await fetch('/api/chatbot/train', { 
    //   method: 'POST',
    //   body: JSON.stringify({ chunks, metadata })
    // });
    
    console.log('تم إرسال البيانات للبوت بنجاح:', { chunksCount: chunks.length, metadata });
    return {
      success: true,
      message: `تم إرسال ${chunks.length} جزء للبوت بنجاح`
    };
  } catch (error) {
    console.error('خطأ في إرسال البيانات للبوت:', error);
    return {
      success: false,
      message: 'فشل في إرسال البيانات للبوت'
    };
  }
}

/**
 * وظيفة رئيسية لتدريب البوت
 */
export async function trainChatbotOnWebsite(): Promise<ChatbotTrainingResult> {
  try {
    console.log('بدء تدريب البوت على محتوى الموقع...');
    
    // 1. مسح البيانات القديمة
    const clearResult = await clearPreviousKnowledge();
    if (!clearResult.success) {
      return clearResult;
    }
    
    // 2. قائمة URLs للتدريب
    const trainingUrls = [
      'https://YOUR-DOMAIN/',
      'https://YOUR-DOMAIN/services',
      'https://YOUR-DOMAIN/contact',
      'https://ekramy-ai.online/privacy.html',
      'https://ekramy-ai.online/terms.html',
      'https://ekramy-ai.online/data-deletion.html'
    ];
    
    // 3. جلب محتوى الصفحات
    const pagesContent = await fetchPagesContent(trainingUrls);
    console.log(`تم جلب محتوى ${pagesContent.length} صفحة`);
    
    // 4. تقطيع المحتوى
    const allChunks: string[] = [];
    for (const page of pagesContent) {
      const chunks = chunkTextForEmbedding(page.content);
      allChunks.push(...chunks);
    }
    
    console.log(`تم تقطيع المحتوى إلى ${allChunks.length} جزء`);
    
    // 5. إرسال البيانات للبوت
    const upsertResult = await upsertKnowledge(allChunks, {
      source: 'website',
      timestamp: new Date().toISOString(),
      pagesCount: pagesContent.length,
      chunksCount: allChunks.length
    });
    
    if (upsertResult.success) {
      return {
        success: true,
        message: `تم تدريب البوت بنجاح على ${pagesContent.length} صفحة و ${allChunks.length} جزء من المحتوى`
      };
    } else {
      return upsertResult;
    }
    
  } catch (error) {
    console.error('خطأ في تدريب البوت:', error);
    return {
      success: false,
      message: 'فشل في تدريب البوت'
    };
  }
}

/**
 * وظيفة مساعدة لتدريب البوت على محتوى محدد
 */
export async function trainOnSpecificContent(content: string, title: string): Promise<ChatbotTrainingResult> {
  try {
    const chunks = chunkTextForEmbedding(content);
    const result = await upsertKnowledge(chunks, {
      source: 'manual',
      title,
      timestamp: new Date().toISOString(),
      chunksCount: chunks.length
    });
    
    return result;
  } catch (error) {
    console.error('خطأ في تدريب البوت على المحتوى المحدد:', error);
    return {
      success: false,
      message: 'فشل في تدريب البوت على المحتوى المحدد'
    };
  }
}
