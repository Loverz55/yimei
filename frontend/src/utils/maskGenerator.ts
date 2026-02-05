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

      // 计算选区的实际像素坐标
      const x = (selection.x / 100) * canvas.width;
      const y = (selection.y / 100) * canvas.height;
      const width = (selection.width / 100) * canvas.width;
      const height = (selection.height / 100) * canvas.height;

      // 绘制白色矩形（修改区域）
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, width, height);

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
