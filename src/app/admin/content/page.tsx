'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

export default function ContentManagementPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft' as 'active' | 'inactive' | 'draft'
  });

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, []);

  const fetchContent = async () => {
    // Mock data for now - replace with actual API call
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'كيف أحجز استشارة؟',
        content: 'يمكنك الحجز عبر واتساب أو عبر الموقع الإلكتروني',
        category: 'booking',
        tags: ['حجز', 'استشارة', 'واتساب'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'ما هي خدمات التسويق الإلكتروني؟',
        content: 'نقدم خدمات التسويق عبر السوشيال ميديا والإعلانات المدفوعة',
        category: 'marketing',
        tags: ['تسويق', 'إلكتروني', 'سوشيال ميديا'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setContentItems(mockContent);
  };

  const fetchCategories = async () => {
    // Mock data for now - replace with actual API call
    const mockCategories: Category[] = [
      { id: 'booking', name: 'الحجز والاستشارات', description: 'معلومات الحجز والمواعيد', count: 5 },
      { id: 'marketing', name: 'التسويق الإلكتروني', description: 'خدمات التسويق والإعلانات', count: 8 },
      { id: 'design', name: 'التصميم والجرافيك', description: 'خدمات التصميم والتصوير', count: 6 },
      { id: 'ai', name: 'الذكاء الاصطناعي', description: 'حلول البوتات والذكاء الاصطناعي', count: 4 }
    ];
    setCategories(mockCategories);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewItem({
      title: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft'
    });
  };

  const handleSave = async () => {
    if (!newItem.title || !newItem.content || !newItem.category) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const item: ContentItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      category: newItem.category,
      tags: newItem.tags.split(',').map(tag => tag.trim()),
      status: newItem.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setContentItems(prev => [...prev, item]);
    setIsAddingNew(false);
    
    // Reset form
    setNewItem({
      title: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft'
    });
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setNewItem({
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags.join(', '),
      status: item.status
    });
    setIsAddingNew(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    const updatedItem: ContentItem = {
      ...editingItem,
      title: newItem.title,
      content: newItem.content,
      category: newItem.category,
      tags: newItem.tags.split(',').map(tag => tag.trim()),
      status: newItem.status,
      updatedAt: new Date()
    };

    setContentItems(prev => prev.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    
    setEditingItem(null);
    setIsAddingNew(false);
    
    // Reset form
    setNewItem({
      title: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft'
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
      setContentItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المحتوى</h1>
        <p className="text-gray-600">إدارة الأسئلة الشائعة وقاعدة المعرفة</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          إضافة محتوى جديد
        </button>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">جميع الفئات</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="البحث في المحتوى..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingItem ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="عنوان المحتوى"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">مسودة</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمات المفتاحية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={newItem.tags}
                  onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="كلمة1, كلمة2, كلمة3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المحتوى
                </label>
                <textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="محتوى الإجابة أو المعلومات"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={editingItem ? handleUpdate : handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingItem ? 'تحديث' : 'حفظ'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingItem(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      <div className="grid gap-4">
        {filteredContent.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'active' ? 'نشط' : 
                       item.status === 'inactive' ? 'غير نشط' : 'مسودة'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {categories.find(c => c.id === item.category)?.name || item.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 px-2 py-1"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 px-2 py-1"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{item.content}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-3">
                آخر تحديث: {item.updatedAt.toLocaleDateString('ar-EG')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          لا يوجد محتوى لعرضه
        </div>
      )}
    </div>
  );
}
