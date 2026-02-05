"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--cream)] relative overflow-hidden flex flex-col noise-overlay">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,var(--rose-gold-pale)_0%,transparent_60%)] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,var(--sage-light)_0%,transparent_60%)] opacity-40 pointer-events-none" />

      {/* 装饰圆环 */}
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] border border-[var(--rose-gold-light)] rounded-full opacity-20 animate-float pointer-events-none" />
      <div className="absolute bottom-[30%] left-[5%] w-[200px] h-[200px] border border-[var(--gold-accent)] rounded-full opacity-15 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 py-8">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--rose-gold)] to-[var(--rose-gold-light)] flex items-center justify-center">
              <span className="text-white text-xl font-light">A</span>
            </div>
            <div>
              <span className="text-2xl tracking-[0.2em] text-[var(--charcoal)] font-light">
                AESTHETI<span className="text-[var(--rose-gold)]">CORE</span>
              </span>
              <p className="text-[10px] tracking-[0.3em] text-[var(--warm-gray)] uppercase">Medical Aesthetics Intelligence</p>
            </div>
          </div>
          <Link href="/login" className="btn-outline text-xs">
            进入系统
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-8 py-16 grid lg:grid-cols-2 gap-16 items-center">
          {/* 左侧文字 */}
          <div className="space-y-8">
            <div className="space-y-2 opacity-0 animate-fade-up">
              <p className="text-[var(--rose-gold)] text-sm tracking-[0.3em] uppercase">AI-Powered Beauty</p>
              <div className="line-elegant"></div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-light text-[var(--charcoal)] leading-[1.2] opacity-0 animate-fade-up delay-1">
              让美丽
              <br />
              <span className="text-gradient">可预见</span>
            </h1>

            <p className="text-[var(--warm-gray)] text-lg leading-relaxed max-w-md opacity-0 animate-fade-up delay-2">
              融合人工智能与医学美学，为每一位求美者呈现专属的蜕变之旅
            </p>

            <div className="flex gap-4 opacity-0 animate-fade-up delay-3">
              <Link href="/facesim" className="btn-luxury">
                <span>开始体验</span>
              </Link>
              <Link href="#services" className="btn-outline">
                了解更多
              </Link>
            </div>

            {/* 数据 */}
            <div className="flex gap-12 pt-8 border-t border-[var(--warm-gray-light)]/30 opacity-0 animate-fade-up delay-4">
              {[
                { value: "98%", label: "客户满意度" },
                { value: "3秒", label: "AI分析" },
                { value: "10万+", label: "服务案例" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl text-[var(--charcoal)] font-light">{stat.value}</div>
                  <div className="text-xs text-[var(--warm-gray)] tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧视觉 */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-[var(--cream-dark)] to-white border border-[var(--warm-gray-light)]/20 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M50%200L100%2050L50%20100L0%2050Z%22%20fill%3D%22none%22%20stroke%3D%22%23B76E79%22%20stroke-width%3D%220.5%22%20opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')] opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-[var(--rose-gold-pale)] flex items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--rose-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <p className="text-[var(--charcoal)] text-lg">AI 美学分析</p>
                  <p className="text-[var(--warm-gray)] text-sm">智能识别面部特征<br/>精准预测术后效果</p>
                </div>
              </div>
            </div>
            {/* 浮动卡片 */}
            <div className="absolute -left-8 top-1/4 bg-white rounded-2xl p-4 shadow-xl border border-[var(--warm-gray-light)]/10 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--sage-light)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--sage)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--charcoal)]">皮肤分析完成</p>
                  <p className="text-xs text-[var(--warm-gray)]">检测到3个改善点</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 服务模块 */}
      <section id="services" className="relative z-10 py-24 bg-white/50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[var(--rose-gold)] text-sm tracking-[0.3em] uppercase">Our Services</p>
            <h2 className="text-3xl font-light text-[var(--charcoal)]">核心功能</h2>
            <div className="line-elegant mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "FaceSim",
                subtitle: "AI 美学模拟器",
                description: "上传照片，AI 智能分析面部特征，实时预览祛痘、祛斑等术后效果",
                href: "/facesim",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
              },
              {
                name: "BrandGuard",
                subtitle: "品牌守护引擎",
                description: "一键生成符合品牌 VI 的营销海报，内置违禁词检测，合规无忧",
                href: "/poster-gen",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                ),
              },
            ].map((service, i) => (
              <Link
                key={service.name}
                href={service.href}
                className="group card-elegant rounded-2xl p-8 opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--rose-gold-pale)] text-[var(--rose-gold)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rose-gold)] group-hover:text-white transition-all duration-500">
                    {service.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl text-[var(--charcoal)] group-hover:text-[var(--rose-gold)] transition-colors">
                        {service.name}
                      </h3>
                      <svg className="w-4 h-4 text-[var(--warm-gray-light)] group-hover:text-[var(--rose-gold)] group-hover:translate-x-2 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--rose-gold-light)]">{service.subtitle}</p>
                    <p className="text-[var(--warm-gray)] text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-[var(--warm-gray-light)]/20">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm tracking-[0.2em] text-[var(--warm-gray)]">AESTHETICORE</span>
            <span className="text-[var(--warm-gray-light)]">·</span>
            <span className="text-sm text-[var(--warm-gray)]">© 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[var(--warm-gray)]">
            <span>专业</span>
            <span className="w-1 h-1 rounded-full bg-[var(--rose-gold-light)]"></span>
            <span>安全</span>
            <span className="w-1 h-1 rounded-full bg-[var(--rose-gold-light)]"></span>
            <span>优雅</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
