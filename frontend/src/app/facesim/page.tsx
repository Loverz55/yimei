'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/facesim/ImageUploader';
import { uploadImage } from '@/lib/facesim-api';

export default function FaceSimPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      router.push(`/facesim/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const steps = [
    {
      num: '01',
      title: '上传照片',
      desc: '上传正面清晰照片或使用摄像头拍照',
    },
    {
      num: '02',
      title: '智能分析',
      desc: '系统将自动分析皮肤问题',
    },
    {
      num: '03',
      title: '效果预览',
      desc: '调节参数查看不同程度的治疗效果',
    },
    {
      num: '04',
      title: '导出分享',
      desc: '导出对比图用于咨询和记录',
    },
  ];

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
            <Link href="/brandguard" className="text-sm text-[var(--neutral-500)] hover:text-[var(--brand-primary)] transition-colors">
              BrandGuard
            </Link>
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              登录
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container-luxury pt-16 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-secondary)] text-[var(--brand-primary)] text-sm mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI 美学模拟
          </div>
          <h1 className="font-medium text-4xl md:text-5xl text-[var(--neutral-800)] mb-4">
            FaceSim 2D 皮肤模拟
          </h1>
          <p className="text-lg text-[var(--neutral-500)] font-light">
            上传照片，AI 智能分析皮肤问题，预览治疗后的模拟效果
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container-luxury pb-16">
        <div className="max-w-xl mx-auto">
          <div className="card p-8">
            <ImageUploader onUpload={handleUpload} isLoading={isUploading} />

            {error && (
              <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="container-luxury pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-medium text-2xl text-[var(--neutral-800)] mb-2">使用流程</h2>
            <div className="decoration-line mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all duration-300">
                  <span className="font-medium text-xl">{step.num}</span>
                </div>
                <h3 className="text-[var(--neutral-800)] font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--neutral-500)] font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-[var(--neutral-200)]">
        <div className="container-luxury py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: '毫秒级响应',
                desc: 'AI 模型实时处理，3秒内完成分析',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: '医学级精准',
                desc: '基于皮肤病理学的专业分析模型',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
                title: '隐私保护',
                desc: '数据本地化存储，严格遵循 PIPL',
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
      </section>
    </div>
  );
}
