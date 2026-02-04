"use client";

import { Template } from "@/type/brandguard";
import { useState } from "react";

interface PosterEditorProps {
  template: Template;
  content: string;
  onContentChange: (content: string) => void;
}

export default function PosterEditor({
  template,
  content,
  onContentChange,
}: PosterEditorProps) {
  const [preview, setPreview] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // const result = await brandguardApi.generatePoster({
      //   templateId: template.id,
      //   content,
      //   size: 'moments'
      // })
      // setPreview(result.imageUrl)
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          海报文案
        </label>
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="输入海报文案内容..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0E9] focus:border-transparent resize-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!content || generating}
        className="w-full bg-[#00A0E9] text-white py-3 rounded-lg font-medium hover:bg-[#0090D0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {generating ? "生成中..." : "生成海报预览"}
      </button>

      {preview && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">预览效果</p>
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="海报预览" className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
