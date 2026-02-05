'use client';

import { useState, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  originalImageAtom,
  selectedAreaAtom,
  editPromptAtom,
  isProcessingAtom,
  editedImageAtom,
  errorMessageAtom,
} from '@/store/facesim';
import { editImageApi } from '@/api/facesim';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function FaceSimEditForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalImage, setOriginalImage] = useAtom(originalImageAtom);
  const selectedArea = useAtomValue(selectedAreaAtom);
  const [editPrompt, setEditPrompt] = useAtom(editPromptAtom);
  const [isProcessing, setIsProcessing] = useAtom(isProcessingAtom);
  const setEditedImage = useSetAtom(editedImageAtom);
  const setError = useSetAtom(errorMessageAtom);

  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setOriginalImage({ url, file });
      setEditedImage(null);
      toast.success('图片上传成功');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) {
      toast.error('请先上传图片');
      return;
    }

    if (!selectedArea) {
      toast.error('请在图片上框选需要编辑的区域');
      return;
    }

    if (!editPrompt.trim()) {
      toast.error('请输入编辑提示词');
      return;
    }

    if (!originalImage.file) {
      toast.error('图片文件丢失，请重新上传');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 调用 FaceSim 编辑 API
      const result = await editImageApi({
        imageFile: originalImage.file,
        selection: selectedArea,
        prompt: editPrompt.trim(),
      });

      // 设置编辑后的图片
      setEditedImage({
        url: result.imageUrl,
        timestamp: Date.now(),
      });

      toast.success('图片编辑成功！');
    } catch (error: any) {
      const errorMsg = error.message || '编辑失败';
      setError(errorMsg);
      toast.error('生成失败', {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setEditPrompt('');
    setError(null);
    toast.info('已重置');
  };

  return (
    <div className="space-y-6">
      {/* 图片上传 */}
      <div className="space-y-2">
        <Label>上传图片*</Label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${originalImage ? 'bg-muted/30' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isProcessing}
          />

          {originalImage ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">图片已上传</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                重新上传
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  选择图片
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  或拖放图片到此处
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 编辑提示词 */}
      <div className="space-y-2">
        <Label htmlFor="editPrompt">编辑提示词*</Label>
        <textarea
          id="editPrompt"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder="描述你想要对选中区域进行的修改，例如：将这部分皮肤变得更光滑，去除痘印..."
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground">
          请先在右侧图片上框选区域，然后输入修改描述
        </p>
      </div>

      {/* 使用提示 */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          使用说明
        </h4>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>上传一张照片</li>
          <li>在右侧预览图上拖动鼠标框选需要编辑的区域</li>
          <li>输入对该区域的修改描述</li>
          <li>点击"生成编辑"按钮</li>
        </ol>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={
            isProcessing ||
            !originalImage ||
            !selectedArea ||
            !editPrompt.trim()
          }
          className="flex-1"
          size="lg"
        >
          {isProcessing ? '生成中...' : '生成编辑'}
        </Button>
        {originalImage && (
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isProcessing}
            size="lg"
          >
            重置
          </Button>
        )}
      </div>
    </div>
  );
}
