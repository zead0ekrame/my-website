'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  category: 'system' | 'user' | 'business' | 'security';
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  whatsapp: boolean;
  sound: boolean;
  categories: string[];
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    whatsapp: false,
    sound: true,
    categories: ['system', 'user', 'business', 'security']
  });
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    // Mock notifications - replace with actual API calls
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'مستخدم جديد',
        message: 'انضم عميل جديد للنظام',
        type: 'success',
        priority: 'medium',
        timestamp: new Date(),
        isRead: false,
        category: 'user'
      },
      {
        id: '2',
        title: 'استخدام عالي',
        message: 'استخدام النظام وصل لـ 80%',
        type: 'warning',
        priority: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        category: 'system'
      },
      {
        id: '3',
        title: 'طلب حجز عاجل',
        message: 'عميل يطلب حجز استشارة عاجلة',
        type: 'info',
        priority: 'critical',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false,
        category: 'business',
        actionUrl: '/admin/clients'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return '⚙️';
      case 'user': return '👤';
      case 'business': return '💼';
      case 'security': return '🔒';
      default: return '📢';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'critical') return notif.priority === 'critical';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام التنبيهات</h1>
            <p className="text-gray-600">إدارة التنبيهات والإشعارات</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ⚙️ الإعدادات
            </button>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تحديد الكل كمقروء
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي التنبيهات</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <div className="text-3xl">📢</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">غير مقروءة</p>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                </div>
                <div className="text-3xl">👁️</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">حرجة</p>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
                <div className="text-3xl">🚨</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>إعدادات التنبيهات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">طرق الإشعار</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.checked }))}
                      className="mr-2"
                    />
                    📧 إشعارات البريد الإلكتروني
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.push}
                      onChange={(e) => setSettings(prev => ({ ...prev, push: e.target.checked }))}
                      className="mr-2"
                    />
                    🔔 إشعارات Push
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.whatsapp}
                      onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.checked }))}
                      className="mr-2"
                    />
                    📱 إشعارات واتساب
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sound}
                      onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                      className="mr-2"
                    />
                    🔊 تنبيهات صوتية
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">فئات التنبيهات</h4>
                <div className="space-y-3">
                  {['system', 'user', 'business', 'security'].map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings(prev => ({
                              ...prev,
                              categories: [...prev.categories, category]
                            }));
                          } else {
                            setSettings(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {getCategoryIcon(category)} {category === 'system' ? 'النظام' :
                                               category === 'user' ? 'المستخدمين' :
                                               category === 'business' ? 'الأعمال' : 'الأمان'}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            الكل ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            غير مقروءة ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'critical' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            حرجة ({criticalCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'critical' ? 'حرج' :
                         notification.priority === 'high' ? 'عالي' :
                         notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {getCategoryIcon(notification.category)} {notification.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {notification.timestamp.toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1"
                      title="تحديد كمقروء"
                    >
                      👁️
                    </button>
                  )}
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="text-green-600 hover:text-green-800 px-2 py-1"
                      title="عرض التفاصيل"
                    >
                      🔗
                    </a>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 px-2 py-1"
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          لا توجد تنبيهات لعرضها
        </div>
      )}
    </div>
  );
}
