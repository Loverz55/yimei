'use client';

import { useRef, useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  originalImageAtom,
  editedImageAtom,
  selectedAreaAtom,
  isProcessingAtom,
  type SelectionArea,
  type RectangleSelection,
  type FreehandSelection,
} from '@/store/facesim';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ViewMode = 'single' | 'sideBySide' | 'slider';
type DrawMode = 'rectangle' | 'freehand';

export function SelectableImagePreview() {
  const originalImage = useAtomValue(originalImageAtom);
  const editedImage = useAtomValue(editedImageAtom);
  const [selectedArea, setSelectedArea] = useAtom(selectedAreaAtom);
  const isProcessing = useAtomValue(isProcessingAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 绘制模式
  const [drawMode, setDrawMode] = useState<DrawMode>('freehand');
  const [isDrawing, setIsDrawing] = useState(false);

  // 矩形选择
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);

  // 自由绘制
  const [freehandPoints, setFreehandPoints] = useState<Array<{ x: number; y: number }>>([]);

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

    if (drawMode === 'rectangle') {
      setStartPoint({ x, y });
      setCurrentPoint({ x, y });
    } else {
      // 自由绘制模式：开始新路径
      setFreehandPoints([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (drawMode === 'rectangle') {
      if (!startPoint) return;
      setCurrentPoint({ x, y });
    } else {
      // 自由绘制模式：添加点到路径
      setFreehandPoints((prev) => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    if (drawMode === 'rectangle') {
      if (!startPoint || !currentPoint) return;

      const x = Math.min(startPoint.x, currentPoint.x);
      const y = Math.min(startPoint.y, currentPoint.y);
      const width = Math.abs(currentPoint.x - startPoint.x);
      const height = Math.abs(currentPoint.y - startPoint.y);

      // 只有在框选区域足够大时才保存
      if (width > 2 && height > 2) {
        setSelectedArea({
          type: 'rectangle',
          x,
          y,
          width,
          height,
        });
        toast.success('区域已选中');
      }

      setStartPoint(null);
      setCurrentPoint(null);
    } else {
      // 自由绘制模式：完成路径
      if (freehandPoints.length < 3) {
        toast.error('路径太短，请绘制更大的区域');
        setFreehandPoints([]);
      } else {
        // 计算边界框
        const xs = freehandPoints.map((p) => p.x);
        const ys = freehandPoints.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        setSelectedArea({
          type: 'freehand',
          points: freehandPoints,
          boundingBox: {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
          },
        });
        toast.success('区域已选中');
        setFreehandPoints([]);
      }
    }

    setIsDrawing(false);
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

  // 计算当前绘制的矩形或路径
  const getCurrentDrawing = (): { type: 'rectangle'; rect: RectangleSelection } | { type: 'freehand'; points: Array<{ x: number; y: number }> } | null => {
    if (!isDrawing) return null;

    if (drawMode === 'rectangle') {
      if (!startPoint || !currentPoint) return null;

      const x = Math.min(startPoint.x, currentPoint.x);
      const y = Math.min(startPoint.y, currentPoint.y);
      const width = Math.abs(currentPoint.x - startPoint.x);
      const height = Math.abs(currentPoint.y - startPoint.y);

      return {
        type: 'rectangle',
        rect: { type: 'rectangle', x, y, width, height },
      };
    } else {
      if (freehandPoints.length === 0) return null;
      return {
        type: 'freehand',
        points: freehandPoints,
      };
    }
  };

  const currentDrawing = getCurrentDrawing();

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

            {/* 绘制选区 */}
            {viewMode === 'single' && !isProcessing && (
              <>
                {/* 正在绘制中 */}
                {currentDrawing && currentDrawing.type === 'rectangle' && !editedImage && (
                  <div
                    className="absolute border-2 border-primary bg-primary/10"
                    style={{
                      left: `${currentDrawing.rect.x}%`,
                      top: `${currentDrawing.rect.y}%`,
                      width: `${currentDrawing.rect.width}%`,
                      height: `${currentDrawing.rect.height}%`,
                    }}
                  />
                )}

                {currentDrawing && currentDrawing.type === 'freehand' && !editedImage && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`M ${currentDrawing.points.map((p) => `${p.x} ${p.y}`).join(' L ')}`}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {/* 已保存的选区 */}
                {selectedArea && selectedArea.type === 'rectangle' && (
                  <div
                    className="absolute border-2 border-primary bg-primary/10"
                    style={{
                      left: `${selectedArea.x}%`,
                      top: `${selectedArea.y}%`,
                      width: `${selectedArea.width}%`,
                      height: `${selectedArea.height}%`,
                    }}
                  >
                    {/* 四个角的手柄 */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}

                {selectedArea && selectedArea.type === 'freehand' && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`M ${selectedArea.points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`}
                      fill="hsl(var(--primary) / 0.1)"
                      stroke="hsl(var(--primary))"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </>
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
        {/* 绘制模式切换 */}
        {displayImage && !editedImage && (
          <div className="flex gap-2 justify-center">
            <Button
              variant={drawMode === 'rectangle' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDrawMode('rectangle')}
              disabled={isProcessing}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              矩形框选
            </Button>
            <Button
              variant={drawMode === 'freehand' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDrawMode('freehand')}
              disabled={isProcessing}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              自由绘制
            </Button>
          </div>
        )}

        {selectedArea && !editedImage && (
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <span>
              {selectedArea.type === 'rectangle'
                ? `选区: ${selectedArea.width.toFixed(1)}% × ${selectedArea.height.toFixed(1)}%`
                : `选区: 自由绘制 (${selectedArea.points.length} 个点)`
              }
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
            {drawMode === 'rectangle'
              ? '在图片上拖动鼠标框选需要编辑的区域'
              : '在图片上按住鼠标左键绘制需要编辑的区域'
            }
          </p>
        )}
      </div>
    </div>
  );
}
