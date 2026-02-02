'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SkinAnalysis from '@/components/facesim/SkinAnalysis';
import BeforeAfterSlider from '@/components/facesim/BeforeAfterSlider';
import { simulateSkin, exportComparison, type SkinAnalysisResult, type SimulationResult } from '@/lib/facesim-api';

export default function FaceSimDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [acneReduction, setAcneReduction] = useState(70);
  const [spotReduction, setSpotReduction] = useState(70);
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide'>('slider');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // 模拟加载分析结果
    setAnalysis({
      id,
      originalImage: '/placeholder-face.jpg',
      issues: [
        { type: 'acne', severity: 3, position: { x: 100, y: 150 } },
        { type: 'spot', severity: 2, position: { x: 200, y: 180 } },
      ],
      overallScore: 72,
    });
  }, [id]);

  useEffect(() => {
    if (analysis) {
      handleSimulate();
    }
  }, [acneReduction, spotReduction, analysis]);

  const handleSimulate = async () => {
    if (!analysis) return;

    setIsSimulating(true);
    try {
      const result = await simulateSkin(id, { acneReduction, spotReduction });
      if (result.success && result.data) {
        setSimulation(result.data);
      }
    } catch (error) {
      // 处理错误
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExport = async () => {
    if (!simulation) return;

    setIsExporting(true);
    try {
      const blob = await exportComparison(id, simulation.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facesim-comparison-${id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('导出失败');
    } finally {
      setIsExporting(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00A0E9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">分析中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">模拟效果</h1>
          <p className="text-gray-600">调节参数查看不同程度的治疗效果</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">效果对比</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('slider')}
                    className={`px-4 py-2 rounded ${
                      viewMode === 'slider'
                        ? 'bg-[#00A0E9] text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    滑动对比
                  </button>
                  <button
                    onClick={() => setViewMode('sideBySide')}
                    className={`px-4 py-2 rounded ${
                      viewMode === 'sideBySide'
                        ? 'bg-[#00A0E9] text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    左右对比
                  </button>
                </div>
              </div>

              {simulation ? (
                <BeforeAfterSlider
                  beforeImage={analysis.originalImage}
                  afterImage={simulation.simulatedImage}
                  mode={viewMode}
                />
              ) : (
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">生成模拟效果中...</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-6">调节参数</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-700">祛痘程度</label>
                    <span className="text-[#00A0E9] font-semibold">{acneReduction}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={acneReduction}
                    onChange={(e) => setAcneReduction(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A0E9]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-700">祛斑程度</label>
                    <span className="text-[#00A0E9] font-semibold">{spotReduction}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={spotReduction}
                    onChange={(e) => setSpotReduction(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A0E9]"
                  />
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={!simulation || isExporting}
                className="w-full mt-6 px-6 py-3 bg-[#00A0E9] text-white rounded-lg hover:bg-[#0088c7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? '导出中...' : '导出对比图'}
              </button>
            </div>
          </div>

          <div>
            <SkinAnalysis result={analysis} />
          </div>
        </div>
      </div>
    </div>
  );
}
