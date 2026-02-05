import type { SelectionArea } from '@/store/facesim';

/**
 * 根据原始图片和选区生成遮罩图
 * 遮罩图是黑白图片，白色区域表示需要修改的部分，黑色区域表示保留的部分
 *
 * @param imageUrl 原始图片的 URL
 * @param selection 选区信息（百分比坐标）
 * @returns 遮罩图的 Blob 对象
 */
export async function generateMask(
  imageUrl: string,
  selection: SelectionArea
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 canvas context'));
        return;
      }

      // 填充黑色背景（保留区域）
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 设置白色填充（修改区域）
      ctx.fillStyle = 'white';

      if (selection.type === 'rectangle') {
        // 矩形选区
        const x = (selection.x / 100) * canvas.width;
        const y = (selection.y / 100) * canvas.height;
        const width = (selection.width / 100) * canvas.width;
        const height = (selection.height / 100) * canvas.height;

        ctx.fillRect(x, y, width, height);
      } else {
        // 自由绘制选区
        if (selection.points.length < 3) {
          reject(new Error('选区路径点数不足'));
          return;
        }

        ctx.beginPath();

        // 转换第一个点为实际像素坐标
        const firstPoint = selection.points[0];
        ctx.moveTo(
          (firstPoint.x / 100) * canvas.width,
          (firstPoint.y / 100) * canvas.height
        );

        // 绘制路径
        for (let i = 1; i < selection.points.length; i++) {
          const point = selection.points[i];
          ctx.lineTo(
            (point.x / 100) * canvas.width,
            (point.y / 100) * canvas.height
          );
        }

        // 闭合路径
        ctx.closePath();
        ctx.fill();
      }

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('生成遮罩图失败'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      reject(new Error('加载图片失败'));
    };

    img.src = imageUrl;
  });
}

/**
 * 将 Blob 转换为 File 对象
 *
 * @param blob Blob 对象
 * @param filename 文件名
 * @returns File 对象
 */
export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type });
}
