"use client";

import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  selectedProviderIdAtom,
  isGeneratingAtom,
  currentGeneratedImageAtom,
  generationErrorAtom,
} from "@/store/imageGen";
import { generateImgApi } from "@/api/imagegen";
import type { GenerateImageRequest } from "@/type/imagegen";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProviderSelector } from "./ProviderSelector";

export function GenerateForm() {
  const [selectedProviderId] = useAtom(selectedProviderIdAtom);
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAtom);
  const setCurrentImage = useSetAtom(currentGeneratedImageAtom);
  const setError = useSetAtom(generationErrorAtom);

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 高级选项
  const [aspectRatio, setAspectRatio] = useState<
    "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
  >("1:1");
  const [steps, setSteps] = useState(30);
  const [cfgScale, setCfgScale] = useState(7);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("请输入提示词");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const requestData: GenerateImageRequest = {
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        configId: selectedProviderId,
        aspectRatio,
        steps,
        cfgScale,
      };

      const res = await generateImgApi(requestData);

      if (res.code !== 0 || !res.data) {
        toast.error(res.msg);
        return;
      }

      const result = res.data;

      setCurrentImage(result);
      toast.success("图片生成成功！");
    } catch (error: any) {
      const errorMsg = error.message || "图片生成失败";
      setError(errorMsg);
      toast.error("生成失败", {
        description: errorMsg,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Provider选择 */}
      <ProviderSelector />

      {/* 提示词 */}
      <div className="space-y-2">
        <Label htmlFor="prompt">提示词（Prompt）*</Label>
        <textarea
          id="prompt"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder="描述你想要生成的海报内容，例如：一张医美诊所的宣传海报，现代简约风格，粉色和白色配色，高端奢华感..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <p className="text-xs text-muted-foreground">
          详细描述能得到更好的效果
        </p>
      </div>

      {/* 负面提示词 */}
      <div className="space-y-2">
        <Label htmlFor="negativePrompt">负面提示词（可选）</Label>
        <textarea
          id="negativePrompt"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder="描述不想要的元素，例如：模糊，低质量，变形，文字错误..."
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      {/* 高级选项 */}
      <div>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "隐藏" : "显示"}高级选项
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 rounded-lg border p-4">
            {/* 宽高比 */}
            <div className="space-y-2">
              <Label htmlFor="aspectRatio">宽高比</Label>
              <select
                id="aspectRatio"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                disabled={isGenerating}
              >
                <option value="1:1">1:1 (正方形)</option>
                <option value="16:9">16:9 (横向)</option>
                <option value="9:16">9:16 (竖向)</option>
                <option value="4:3">4:3 (横向)</option>
                <option value="3:4">3:4 (竖向)</option>
              </select>
            </div>

            {/* 生成步数 */}
            <div className="space-y-2">
              <Label htmlFor="steps">生成步数: {steps}</Label>
              <Input
                type="range"
                id="steps"
                min="10"
                max="150"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                步数越多质量越好，但生成时间越长
              </p>
            </div>

            {/* CFG Scale */}
            <div className="space-y-2">
              <Label htmlFor="cfgScale">CFG Scale: {cfgScale}</Label>
              <Input
                type="range"
                id="cfgScale"
                min="1"
                max="20"
                value={cfgScale}
                onChange={(e) => setCfgScale(Number(e.target.value))}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                控制AI对提示词的遵循程度，7-10为推荐值
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 生成按钮 */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "生成中..." : "生成海报"}
      </Button>
    </div>
  );
}
