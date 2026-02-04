'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Provider配置',
    href: '/admin/providers',
    icon: '🔧',
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: '👥',
  },
  {
    title: '生成统计',
    href: '/admin/stats',
    icon: '📊',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-muted/10 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">管理后台</h2>
        <p className="text-sm text-muted-foreground mt-1">系统配置与管理</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t">
        <Link
          href="/poster-gen"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← 返回海报生成
        </Link>
      </div>
    </div>
  );
}
