export interface SkinIssue {
  type: "acne" | "spot" | "wrinkle";
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
