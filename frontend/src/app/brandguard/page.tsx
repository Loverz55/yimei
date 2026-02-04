"use client";

import { useState } from "react";
import Link from "next/link";
import TemplateSelector from "@/components/brandguard/TemplateSelector";
import PosterEditor from "@/components/brandguard/PosterEditor";
import ComplianceChecker from "@/components/brandguard/ComplianceChecker";
import ExportOptions from "@/components/brandguard/ExportOptions";
import { Template } from "@/type/brandguard";

export default function BrandGuardPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-[var(--neutral-200)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-luxury py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center">
              <span className="text-white font-medium text-sm font-semibold">
                A
              </span>
            </div>
            <span className="font-medium text-xl tracking-tight text-[var(--neutral-800)]">
              Aestheti<span className="text-[var(--brand-primary)]">Core</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/facesim"
              className="text-sm text-[var(--neutral-500)] hover:text-[var(--brand-primary)] transition-colors"
            >
              FaceSim
            </Link>
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              登录
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container-luxury pt-12 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-secondary)] text-[var(--brand-primary)] text-sm mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
              />
            </svg>
            品牌守护
          </div>
          <h1 className="font-medium text-3xl md:text-4xl text-[var(--neutral-800)] mb-3">
            BrandGuard 品牌海报生成
          </h1>
          <p className="text-[var(--neutral-500)] font-light">
            AI 驱动的品牌一致性海报生成，内置违禁词审查，确保合规输出
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-luxury pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <section className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[var(--neutral-800)]">
                    选择模板
                  </h2>
                  <p className="text-sm text-[var(--neutral-500)]">
                    选择符合品牌调性的海报模板
                  </p>
                </div>
              </div>
              <TemplateSelector
                onSelect={setSelectedTemplate}
                selectedId={selectedTemplate?.id}
              />
            </section>

            {/* Poster Editor */}
            {selectedTemplate && (
              <section className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-[var(--neutral-800)]">
                      编辑海报
                    </h2>
                    <p className="text-sm text-[var(--neutral-500)]">
                      输入文案，AI 自动生成海报
                    </p>
                  </div>
                </div>
                <PosterEditor
                  template={selectedTemplate}
                  content={content}
                  onContentChange={setContent}
                />
              </section>
            )}
          </div>

          {/* Right Column - Tools */}
          <div className="space-y-6">
            {/* Compliance Checker */}
            <section className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[var(--neutral-800)]">
                    合规检测
                  </h2>
                  <p className="text-sm text-[var(--neutral-500)]">
                    实时违禁词审查
                  </p>
                </div>
              </div>
              <ComplianceChecker content={content} />
            </section>

            {/* Export Options */}
            {previewUrl && (
              <section className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-[var(--neutral-800)]">
                      导出选项
                    </h2>
                    <p className="text-sm text-[var(--neutral-500)]">
                      多尺寸适配导出
                    </p>
                  </div>
                </div>
                <ExportOptions imageUrl={previewUrl} />
              </section>
            )}

            {/* VI Info Card */}
            <section className="card p-6 bg-gradient-to-br from-[var(--brand-secondary)] to-white border-[var(--brand-primary)]/20">
              <h3 className="text-sm font-medium text-[var(--neutral-800)] mb-4">
                品牌色规范
              </h3>
              <div className="space-y-3">
                {[
                  { name: "医美蓝", color: "#00A0E9" },
                  { name: "纯白", color: "#FFFFFF" },
                  { name: "高级灰", color: "#F2F2F2" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-[var(--neutral-200)]"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-sm text-[var(--neutral-700)]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--neutral-400)] font-mono">
                        {item.color}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
