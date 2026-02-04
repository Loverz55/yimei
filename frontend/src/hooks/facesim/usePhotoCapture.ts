"use client";

import { useState, RefObject } from "react";

/**
 * Canvas拍照Hook配置
 */
export interface UsePhotoCaptureOptions {
  /** 视频元素引用 */
  videoRef: RefObject<HTMLVideoElement>;
  /** 拍照完成回调 */
  onCapture: (file: File) => void;
}

/**
 * Canvas拍照Hook返回类型
 */
export interface UsePhotoCaptureReturn {
  /** 拍照 */
  capture: () => void;
  /** 是否正在处理 */
  capturing: boolean;
}

/**
 * Canvas拍照Hook
 *
 * 从视频流中捕获照片并转换为File对象
 *
 * @example
 * ```tsx
 * const { videoRef } = useCamera();
 * const { capture, capturing } = usePhotoCapture({
 *   videoRef,
 *   onCapture: (file) => {
 *     console.log('拍照完成', file);
 *   },
 * });
 *
 * <button onClick={capture} disabled={capturing}>拍照</button>
 * ```
 */
export function usePhotoCapture(
  options: UsePhotoCaptureOptions
): UsePhotoCaptureReturn {
  const { videoRef, onCapture } = options;
  const [capturing, setCapturing] = useState(false);

  const capture = (): void => {
    if (!videoRef.current) return;

    setCapturing(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("无法获取Canvas上下文");
        return;
      }

      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", {
              type: "image/jpeg",
            });
            onCapture(file);
          }
          setCapturing(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("拍照失败:", error);
      setCapturing(false);
    }
  };

  return {
    capture,
    capturing,
  };
}
