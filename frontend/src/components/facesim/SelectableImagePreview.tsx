'use client';

import { useRef, useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  originalImageAtom,
  editedImageAtom,
  selectedAreaAtom,
  isProcessingAtom,
  type SelectionArea,
} from '@/store/facesim';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ViewMode = 'single' | 'sideBySide' | 'slider';

export function SelectableImagePreview() {
  const originalImage = useAtomValue(originalImageAtom);
  const editedImage = useAtomValue(editedImageAtom);
  const [selectedArea, setSelectedArea] = useAtom(selectedAreaAtom);
  const isProcessing = useAtomValue(isProcessingAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);

  // 对比模式
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [sliderPosition, setSliderPosition] = useState(50); // 滑块位置 (0-100)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // 当前显示的图片（优先显示编辑后的图片）
  const displayImage = editedImage?.url || originalImage?.url;

  // 如果有编辑后的图片，自动切换到对比模式
  useEffect(() => {
    if (editedImage && originalImage) {
      setViewMode('sideBySide');
    } else if (!editedImage && originalImage) {
      setViewMode('single');
    }
  }, [editedImage, originalImage]);

  useEffect(() => {
    // 重置选区当图片改变时
    if (!displayImage) {
      setSelectedArea(null);
    }
  }, [displayImage, setSelectedArea]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!displayImage || isProcessing || viewMode !== 'single') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentPoint({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPoint) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentPoint({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !currentPoint) return;

    const x = Math.min(startPoint.x, currentPoint.x);
    const y = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);

    // 只有在框选区域足够大时才保存
    if (width > 2 && height > 2) {
      setSelectedArea({ x, y, width, height });
      toast.success('区域已选中');
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  // 滑块拖动
  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingSlider(true);
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleSliderMouseUp = () => {
    setIsDraggingSlider(false);
  };

  const handleClearSelection = () => {
    setSelectedArea(null);
    toast.info('已清除选区');
  };

  const handleDownload = async (type: 'original' | 'edited') => {
    const url = type === 'original' ? originalImage?.url : editedImage?.url;
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `facesim-${type}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      toast.success('图片下载成功！');
    } catch (error) {
      toast.error('下载失败，请重试');
    }
  };

  // 计算当前绘制的矩形
  const getCurrentRect = (): SelectionArea | null => {
    if (!isDrawing || !startPoint || !currentPoint) return null;

    const x = Math.min(startPoint.x, currentPoint.x);
    const y = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);

    return { x, y, width, height };
  };

  const drawingRect = getCurrentRect();
  const displayRect = drawingRect || selectedArea;

  if (!displayImage) {
    return (
      <Card className="flex aspect-video items-center justify-center bg-muted">
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
          <p className="text-sm text-muted-foreground">上传图片后将显示在这里</p>
          <p className="text-xs text-muted-foreground">在图片上拖动鼠标框选区域</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 视图模式切换 */}
      {editedImage && originalImage && (
        <div className="flex gap-2 justify-center">
          <Button
            variant={viewMode === 'sideBySide' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('sideBySide')}
          >
            并排对比
          </Button>
          <Button
            variant={viewMode === 'slider' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('slider')}
          >
            滑块对比
          </Button>
          <Button
            variant={viewMode === 'single' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('single')}
          >
            单图模式
          </Button>
        </div>
      )}

      <Card className="overflow-hidden">
        {/* 并排对比模式 */}
        {viewMode === 'sideBySide' && editedImage && originalImage && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted">
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">原图</p>
              <div className="relative aspect-video bg-white rounded overflow-hidden">
                <img
                  src={originalImage.url}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">编辑后</p>
              <div className="relative aspect-video bg-white rounded overflow-hidden">
                <img
                  src={editedImage.url}
                  alt="Edited"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* 滑块对比模式 */}
        {viewMode === 'slider' && editedImage && originalImage && (
          <div
            ref={containerRef}
            className="relative aspect-video bg-muted cursor-col-resize select-none"
            onMouseMove={handleSliderMove}
            onMouseUp={handleSliderMouseUp}
            onMouseLeave={handleSliderMouseUp}
          >
            {/* 编辑后的图片（底层，完整显示） */}
            <img
              src={editedImage.url}
              alt="Edited"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />

            {/* 原图（顶层，使用 clip-path 裁剪） */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <img
                src={originalImage.url}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* 滑块 */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-lg z-10"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleSliderMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* 标签 */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded z-10">
              原图
            </div>
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded z-10">
              编辑后
            </div>
          </div>
        )}

        {/* 单图模式 */}
        {viewMode === 'single' && (
          <div
            ref={containerRef}
            className="relative aspect-video bg-muted cursor-crosshair select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={displayImage}
              alt="Face image"
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />

            {/* 绘制选区矩形 */}
            {displayRect && !editedImage && (
              <div
                className="absolute border-2 border-primary bg-primary/10"
                style={{
                  left: `${displayRect.x}%`,
                  top: `${displayRect.y}%`,
                  width: `${displayRect.width}%`,
                  height: `${displayRect.height}%`,
                }}
              >
                {/* 四个角的手柄 */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="animate-spin h-10 w-10 border-3 border-white border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-white text-sm">正在处理中...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 操作按钮 */}
      <div className="space-y-3">
        {selectedArea && !editedImage && (
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <span>
              选区: {selectedArea.width.toFixed(1)}% × {selectedArea.height.toFixed(1)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              disabled={isProcessing}
            >
              清除选区
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          {editedImage && originalImage ? (
            <>
              <Button
                onClick={() => handleDownload('original')}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                下载原图
              </Button>
              <Button
                onClick={() => handleDownload('edited')}
                variant="default"
                className="flex-1"
                disabled={isProcessing}
              >
                下载编辑后
              </Button>
            </>
          ) : (
            <Button
              onClick={() => handleDownload('original')}
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              下载图片
            </Button>
          )}
        </div>

        {!selectedArea && displayImage && !editedImage && (
          <p className="text-xs text-center text-muted-foreground">
            在图片上拖动鼠标框选需要编辑的区域
          </p>
        )}
      </div>
    </div>
  );
}
