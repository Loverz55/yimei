"use client";

import Link from "next/link";
import { FaceSimEditForm } from "@/components/facesim/FaceSimEditForm";
import { SelectableImagePreview } from "@/components/facesim/SelectableImagePreview";
import { Card } from "@/components/ui/card";

export default function FaceSimPage() {
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
              href="/poster-gen"
              className="text-sm text-[var(--neutral-500)] hover:text-[var(--brand-primary)] transition-colors"
            >
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
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            AI 图片编辑
          </div>
          <h1 className="font-medium text-4xl text-[var(--neutral-800)] mb-3">
            FaceSim 图片编辑器
          </h1>
          <p className="text-lg text-[var(--neutral-500)] font-light">
            上传图片，自由绘制或框选区域，选择医美术语或输入描述，AI
            智能编辑图片局部内容
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury pb-16 px-10">
        <div className="max-w-500 mx-auto flex gap-6">
          {/* Left: Edit Form */}
          <Card className="p-6 w-80 shrink-0">
            <h2 className="text-xl font-semibold mb-6">编辑设置</h2>
            <FaceSimEditForm />
          </Card>

          {/* Right: Image Preview */}
          <Card className="p-6 flex-1">
            <h2 className="text-xl font-semibold mb-6">图片预览</h2>
            <SelectableImagePreview />
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-(--neutral-200)">
        <div className="container-luxury py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-medium text-2xl text-(--neutral-800) mb-2">
                核心功能
              </h2>
              <div className="decoration-line mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  ),
                  title: "自由绘制",
                  desc: "支持矩形框选和自由绘制，精确选择需要编辑的区域",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  ),
                  title: "医美术语库",
                  desc: "内置常用医美术语，一键选择美白、祛痘、瘦脸等效果",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  ),
                  title: "自然语言编辑",
                  desc: "用简单的文字描述想要的修改效果，AI 自动理解",
                },
                {
                  icon: (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                      />
                    </svg>
                  ),
                  title: "AI 智能生成",
                  desc: "先进的 AI 模型，确保编辑结果自然真实",
                },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-secondary)] text-[var(--brand-primary)] flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-[var(--neutral-800)] font-medium mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--neutral-500)] font-light">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
