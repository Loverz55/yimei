'use client'

import { ComplianceCheckResult } from '@/type/brandguard'
import { useEffect, useState } from 'react'

interface ComplianceCheckerProps {
  content: string
}

export default function ComplianceChecker({ content }: ComplianceCheckerProps) {
  const [result, setResult] = useState<ComplianceCheckResult | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!content) {
      setResult(null)
      return
    }

    const timer = setTimeout(() => {
      setChecking(true)
      // brandguardApi.checkCompliance(content)
      //   .then(setResult)
      //   .finally(() => setChecking(false))
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  if (!content) return null

  if (checking) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">检测中...</p>
      </div>
    )
  }

  if (!result) return null

  const severityColors = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    low: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className={`rounded-lg p-4 border ${
      result.isCompliant
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">
          {result.isCompliant ? '✓' : '⚠'}
        </span>
        <h3 className="font-medium">
          {result.isCompliant ? '合规检测通过' : '发现违禁词'}
        </h3>
      </div>

      {result.violations.length > 0 && (
        <div className="space-y-2 mt-3">
          {result.violations.map((v, i) => (
            <div key={i} className={`text-sm px-3 py-2 rounded border ${severityColors[v.severity]}`}>
              <span className="font-medium">{v.word}</span>
              <span className="ml-2 text-xs opacity-75">位置: {v.position}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
