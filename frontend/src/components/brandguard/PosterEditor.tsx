"use client";

import { Template } from "@/type/brandguard";
import { usePosterEditor } from "@/hooks/brandguard";

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
  // 使用海报编辑器hook
  const { preview, generating, generatePoster, setContent } = usePosterEditor({
    template,
    initialContent: content,
    onSuccess: (imageUrl) => {
      console.log("海报生成成功:", imageUrl);
    },
  });

  // 同步外部content变化到hook
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          海报文案
        </label>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="输入海报文案内容..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0E9] focus:border-transparent resize-none"
        />
      </div>

      <button
        onClick={generatePoster}
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
