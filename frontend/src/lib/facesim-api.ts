import { apiRequest } from './api';

export interface SkinIssue {
  type: 'acne' | 'spot' | 'wrinkle';
  severity: number;
  position: { x: number; y: number };
}

export interface SkinAnalysisResult {
  id: string;
  originalImage: string;
  issues: SkinIssue[];
  overallScore: number;
}

export interface SimulationParams {
  acneReduction: number;
  spotReduction: number;
}

export interface SimulationResult {
  id: string;
  simulatedImage: string;
  params: SimulationParams;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/facesim/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('上传失败');
  }

  return response.json() as Promise<SkinAnalysisResult>;
}

export async function simulateSkin(analysisId: string, params: SimulationParams) {
  return apiRequest<SimulationResult>(`/api/facesim/${analysisId}/simulate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function exportComparison(analysisId: string, simulationId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/facesim/${analysisId}/export/${simulationId}`
  );

  if (!response.ok) {
    throw new Error('导出失败');
  }

  return response.blob();
}
