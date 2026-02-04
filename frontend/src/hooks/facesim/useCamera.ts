"use client";

import { useRef, useState, useEffect } from "react";

/**
 * 摄像头Hook返回类型
 */
export interface UseCameraReturn {
  /** 摄像头是否激活 */
  isCameraActive: boolean;
  /** 媒体流 */
  stream: MediaStream | null;
  /** 视频元素引用 */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** 启动摄像头 */
  startCamera: () => Promise<void>;
  /** 停止摄像头 */
  stopCamera: () => void;
  /** 错误信息 */
  error: string | null;
}

/**
 * 摄像头Hook
 *
 * 管理摄像头的启动、停止和资源清理
 *
 * @example
 * ```tsx
 * const { isCameraActive, videoRef, startCamera, stopCamera, error } = useCamera();
 *
 * <button onClick={startCamera}>打开摄像头</button>
 * <video ref={videoRef} autoPlay playsInline />
 * <button onClick={stopCamera}>关闭摄像头</button>
 * ```
 */
export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async (): Promise<void> => {
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: any) {
      const errorMsg = "无法访问摄像头";
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const stopCamera = (): void => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    isCameraActive,
    stream,
    videoRef,
    startCamera,
    stopCamera,
    error,
  };
}
