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