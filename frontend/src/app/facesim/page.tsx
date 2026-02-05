'use client';

import Link from 'next/link';
import { FaceSimEditForm } from '@/components/facesim/FaceSimEditForm';
import { SelectableImagePreview } from '@/components/facesim/SelectableImagePreview';
import { Card } from '@/components/ui/card';

export default function FaceSimPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-[var(--neutral-200)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-luxury py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center">
              <span className="text-white font-medium text-sm font-semibold">A</span>
            </div>
            <span className="font-medium text-xl tracking-tight text-[var(--neutral-800)]">
              Aestheti<span className="text-[var(--brand-primary)]">Core</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/poster-gen" className="text-sm text-[var(--neutral-500)] hover:text-[var(--brand-primary)] transition-colors">
              海报生成
            </Link>
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              登录
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section className="container-luxury pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-secondary)] text-[var(--brand-primary)] text-sm mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI 图片编辑
          </div>
          <h1 className="font-medium text-4xl text-[var(--neutral-800)] mb-3">
            FaceSim 图片编辑器
          </h1>
          <p className="text-lg text-[var(--neutral-500)] font-light">
            上传图片，框选区域，输入描述，AI 智能编辑图片局部内容
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top: Edit Form */}
          <Card className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">编辑设置</h2>
            <FaceSimEditForm />
          </Card>

          {/* Bottom: Image Preview (Full Width) */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">图片预览</h2>
            <SelectableImagePreview />
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-[var(--neutral-200)]">
        <div className="container-luxury py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-medium text-2xl text-[var(--neutral-800)] mb-2">核心功能</h2>
              <div className="decoration-line mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9" />
                    </svg>
                  ),
                  title: '精准框选',
                  desc: '直观的框选工具，精确定位需要编辑的区域',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  ),
                  title: '自然语言编辑',
                  desc: '用简单的文字描述想要的修改效果，AI 自动理解',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  ),
                  title: 'AI 智能生成',
                  desc: '先进的 AI 模型，确保编辑结果自然真实',
                },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-[var(--neutral-800)] font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--neutral-500)] font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
