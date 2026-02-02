'use client'

import { useState, useEffect } from 'react'
import { brandguardApi, type Template } from '@/lib/brandguard-api'

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
  selectedId?: string
}

export default function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    brandguardApi.getTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="animate-pulse grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg" />
      ))}
    </div>
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {templates.map(template => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
            selectedId === template.id ? 'border-[#00A0E9]' : 'border-transparent'
          }`}
        >
          <img src={template.thumbnail} alt={template.name} className="w-full h-32 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <p className="text-white text-sm font-medium">{template.name}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
