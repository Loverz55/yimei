'use client';

import { GenerateForm } from '@/components/poster-gen/GenerateForm';
import { ImagePreview } from '@/components/poster-gen/ImagePreview';
import { GenerationHistory } from '@/components/poster-gen/GenerationHistory';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PosterGenPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI海报生成器</h1>
        <p className="mt-2 text-muted-foreground">
          使用AI技术快速生成专业的医美海报设计
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：生成表单 */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">生成设置</h2>
            <GenerateForm />
          </Card>
        </div>

        {/* 右侧：图片预览 */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">预览结果</h2>
            <ImagePreview />
          </Card>
        </div>
      </div>

      {/* 历史记录 */}
      <div className="mt-12">
        <Separator className="my-8" />
        <h2 className="text-2xl font-semibold mb-6">生成历史</h2>
        <GenerationHistory />
      </div>
    </div>
  );
}
