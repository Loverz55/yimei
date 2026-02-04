'use client';

import { useAtomValue } from 'jotai';
import { currentGeneratedImageAtom, isGeneratingAtom, generationErrorAtom } from '@/store/imageGen';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ImagePreview() {
  const currentImage = useAtomValue(currentGeneratedImageAtom);
  const isGenerating = useAtomValue(isGeneratingAtom);
  const error = useAtomValue(generationErrorAtom);

  const handleDownload = async () => {
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poster-${currentImage.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('图片下载成功！');
    } catch (error) {
      toast.error('下载失败，请重试');
    }
  };

  if (isGenerating) {
    return (
      <Card className="flex aspect-square items-center justify-center bg-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground">AI正在生成图片...</p>
          <p className="text-xs text-muted-foreground">这可能需要30-60秒</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex aspect-square items-center justify-center bg-destructive/10 border-destructive/20">
        <div className="text-center space-y-2 p-6">
          <p className="text-destructive font-medium">生成失败</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  if (!currentImage) {
    return (
      <Card className="flex aspect-square items-center justify-center bg-muted">
        <div className="text-center space-y-2 p-6">
          <svg
            className="h-16 w-16 mx-auto text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-muted-foreground">生成的图片将显示在这里</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-square bg-muted">
          <img
            src={currentImage.imageUrl}
            alt="Generated poster"
            className="w-full h-full object-contain"
          />
        </div>
      </Card>

      {/* 图片信息和操作 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Provider: {currentImage.provider}</span>
          {currentImage.model && <span>Model: {currentImage.model}</span>}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="default" className="flex-1">
            下载图片
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={currentImage.imageUrl} target="_blank" rel="noopener noreferrer">
              在新标签页打开
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
