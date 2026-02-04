import { apiRequest } from './api'

export interface Template {
  id: string
  name: string
  thumbnail: string
  category: string
}

export interface PosterGenerateRequest {
  templateId: string
  content: string
  size: 'moments' | 'grid'
}

export interface ComplianceCheckResult {
  isCompliant: boolean
  violations: Array<{
    word: string
    position: number
    severity: 'high' | 'medium' | 'low'
  }>
}

export const brandguardApi = {
  getTemplates: () => apiRequest<Template[]>('/brandguard/templates'),

  generatePoster: (data: PosterGenerateRequest) =>
    apiRequest<{ imageUrl: string }>('/brandguard/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkCompliance: (content: string) =>
    apiRequest<ComplianceCheckResult>('/brandguard/check', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  exportPoster: (imageUrl: string, size: string) =>
    apiRequest<{ downloadUrl: string }>('/brandguard/export', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, size }),
    }),
}
