'use client';

import { SkinAnalysisResult } from '@/lib/facesim-api';

interface SkinAnalysisProps {
  result: SkinAnalysisResult;
}

export default function SkinAnalysis({ result }: SkinAnalysisProps) {
  const issueCount = {
    acne: result.issues.filter(i => i.type === 'acne').length,
    spot: result.issues.filter(i => i.type === 'spot').length,
    wrinkle: result.issues.filter(i => i.type === 'wrinkle').length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">皮肤分析结果</h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">综合评分</span>
          <span className="text-2xl font-bold text-[#00A0E9]">{result.overallScore}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#00A0E9] h-2 rounded-full transition-all"
            style={{ width: `${result.overallScore}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <span className="text-gray-700">痘痘</span>
          <span className="font-semibold">{issueCount.acne} 处</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <span className="text-gray-700">色斑</span>
          <span className="font-semibold">{issueCount.spot} 处</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <span className="text-gray-700">皱纹</span>
          <span className="font-semibold">{issueCount.wrinkle} 处</span>
        </div>
      </div>
    </div>
  );
}
