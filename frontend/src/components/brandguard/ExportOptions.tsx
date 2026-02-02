'use client'

import { useState } from 'react'
import { brandguardApi } from '@/lib/brandguard-api'

interface ExportOptionsProps {
  imageUrl: string
}

export default function ExportOptions({ imageUrl }: ExportOptionsProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (size: string) => {
    setExporting(true)
    try {
      const result = await brandguardApi.exportPoster(imageUrl, size)
      window.open(result.downloadUrl, '_blank')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">导出尺寸</h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleExport('moments')}
          disabled={exporting}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-[#00A0E9] hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-8 h-8 text-[#00A0E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
          </svg>
          <span className="text-sm font-medium">朋友圈全屏</span>
          <span className="text-xs text-gray-500">1080x1920</span>
        </button>

        <button
          onClick={() => handleExport('grid')}
          disabled={exporting}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-[#00A0E9] hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-8 h-8 text-[#00A0E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          </svg>
          <span className="text-sm font-medium">九宫格</span>
          <span className="text-xs text-gray-500">1080x1080</span>
        </button>
      </div>
    </div>
  )
}
