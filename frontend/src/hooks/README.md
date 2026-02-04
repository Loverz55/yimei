# Hooks 使用指南

本项目将业务逻辑hooks和UI组件完全分离,每个模块都有独立的hooks文件夹。

## 目录结构

```
frontend/src/hooks/
├── common/          # 通用hooks
│   ├── useAsyncOperation.ts    # 通用异步操作
│   ├── usePagination.ts        # 通用分页
│   ├── useDialog.ts            # 通用对话框
│   ├── useDebounce.ts          # 防抖
│   └── index.ts
├── admin/           # Admin模块hooks
│   ├── useModelConfigList.ts        # 模型配置列表
│   ├── useModelConfigDialog.ts      # 创建/编辑对话框
│   ├── useModelConfigCRUD.ts        # CRUD操作
│   ├── useDeleteDialog.ts           # 删除确认
│   └── index.ts
├── poster-gen/      # 图片生成模块hooks
│   ├── useImageGeneration.ts        # 图片生成
│   ├── useProviderSelector.ts       # Provider选择
│   ├── useGenerationHistory.ts      # 历史记录
│   └── index.ts
├── facesim/         # 面部分析模块hooks
│   ├── useCamera.ts                 # 摄像头操作
│   ├── usePhotoCapture.ts           # Canvas拍照
│   ├── useFileUpload.ts             # 文件上传
│   └── index.ts
├── brandguard/      # 品牌守护模块hooks
│   ├── useComplianceCheck.ts        # 合规检测
│   ├── usePosterEditor.ts           # 海报编辑器
│   └── index.ts
├── auth/            # 认证模块hooks
│   └── useAuth.ts
└── index.ts         # 统一导出入口
```

## 通用Hooks

### useAsyncOperation

封装异步操作的通用逻辑,包括loading状态、错误处理和Toast提示。

```tsx
import { useAsyncOperation } from "@/hooks/common";

const { execute, loading, error, data } = useAsyncOperation(
  async (id: number) => {
    const res = await api.delete(id);
    return res.data;
  },
  {
    successMessage: "删除成功",
    errorMessage: "删除失败",
    onSuccess: () => reload(),
  }
);

// 执行操作
await execute(123);
```

### usePagination

封装分页相关的状态和操作。

```tsx
import { usePagination } from "@/hooks/common";

const { page, totalPages, setPage, nextPage, prevPage } = usePagination({
  total: 100,
  initialPageSize: 20,
});
```

### useDialog

简化对话框状态管理。

```tsx
import { useDialog } from "@/hooks/common";

const dialog = useDialog();

<Button onClick={dialog.open}>打开对话框</Button>
<Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
  <Button onClick={dialog.close}>关闭</Button>
</Dialog>
```

### useDebounce

延迟更新值,用于搜索等场景。

```tsx
import { useDebounce } from "@/hooks/common";

const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

## Admin模块Hooks

### useModelConfigList

管理模型配置列表的数据加载、分页和筛选。

```tsx
import { useModelConfigList } from "@/hooks/admin";

const {
  configs,
  loading,
  page,
  setPage,
  handleFilterChange,
  reload,
} = useModelConfigList();
```

### useModelConfigDialog

管理创建/编辑对话框的状态和表单数据。

```tsx
import { useModelConfigDialog } from "@/hooks/admin";

const dialog = useModelConfigDialog();

// 创建
<Button onClick={dialog.startCreate}>添加配置</Button>

// 编辑
<Button onClick={() => dialog.startEdit(config)}>编辑</Button>

// 对话框
<Dialog open={dialog.isOpen} onOpenChange={dialog.close}>
  <Input
    value={dialog.formData.name}
    onChange={(e) => dialog.updateField("name", e.target.value)}
  />
</Dialog>
```

### useModelConfigCRUD

封装所有CRUD操作的逻辑。

```tsx
import { useModelConfigCRUD } from "@/hooks/admin";

const { create, update, remove, toggleEnabled, validate, submitting } =
  useModelConfigCRUD({
    onSuccess: () => reload(),
  });

// 创建
await create(formData);

// 更新
await update(id, formData);

// 删除
await remove(id);
```

### useDeleteDialog

通用的删除确认对话框管理。

```tsx
import { useDeleteDialog } from "@/hooks/admin";

const deleteDialog = useDeleteDialog<ModelConfig>({
  onDelete: async (config) => {
    return await crud.remove(config.id);
  },
  onSuccess: () => reload(),
});

<Button onClick={() => deleteDialog.openDelete(config)}>删除</Button>

<AlertDialog open={deleteDialog.isOpen}>
  <AlertDialogTitle>
    确认删除 "{deleteDialog.deletingItem?.name}"?
  </AlertDialogTitle>
  <AlertDialogAction onClick={deleteDialog.confirmDelete}>
    删除
  </AlertDialogAction>
</AlertDialog>
```

## Poster-gen模块Hooks

### useImageGeneration

封装图片生成的核心逻辑,集成Jotai全局状态。

```tsx
import { useImageGeneration } from "@/hooks/poster-gen";

const { generate, isGenerating, currentImage, error } = useImageGeneration({
  onSuccess: (result) => {
    console.log("生成成功", result);
  },
});

// 生成图片
await generate({
  prompt: "一张海报",
  configId: selectedProviderId,
  aspectRatio: "1:1",
});
```

### useProviderSelector

管理图片生成Provider的选择和加载。

```tsx
import { useProviderSelector } from "@/hooks/poster-gen";

const { providers, selectedProviderId, selectProvider, loading } =
  useProviderSelector();

<select
  value={selectedProviderId}
  onChange={(e) => selectProvider(Number(e.target.value))}
>
  {providers.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>;
```

### useGenerationHistory

管理图片生成历史记录的加载和查看。

```tsx
import { useGenerationHistory } from "@/hooks/poster-gen";

const { history, loadHistory, viewDetail, loading } = useGenerationHistory();

// 加载历史
useEffect(() => {
  loadHistory();
}, []);

// 查看详情
const handleViewDetail = async (id: number) => {
  const detail = await viewDetail(id);
  console.log(detail);
};
```

## 设计原则

1. **简洁性**: 不使用useMemo和useCallback,保持代码简洁易懂
2. **兼容性**: hooks内部可使用Jotai atoms,不强制迁移现有状态管理
3. **类型安全**: 所有hooks使用严格TypeScript类型定义
4. **错误处理**: 统一使用toast提示错误
5. **遵循模式**: 参考useAuth.ts的实现风格

## 组件重构示例

### 重构前 (ModelConfigList.tsx - 630行)

```tsx
export function ModelConfigList() {
  const [configs, setConfigs] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ModelConfig | null>(null);
  // ... 还有5个useState

  const loadConfigs = async () => {
    // 100行业务逻辑
  };

  const handleCreate = () => {
    // 20行业务逻辑
  };

  // ... 还有很多业务逻辑函数

  return (
    // 400行UI代码
  );
}
```

### 重构后 (ModelConfigList.tsx - 458行)

```tsx
export function ModelConfigList() {
  // 使用hooks管理所有业务逻辑
  const list = useModelConfigList();
  const dialog = useModelConfigDialog();
  const crud = useModelConfigCRUD({ onSuccess: () => list.reload() });
  const deleteDialog = useDeleteDialog<ModelConfig>({
    onDelete: async (config) => crud.remove(config.id),
    onSuccess: () => list.reload(),
  });

  const handleSubmit = async () => {
    const success = dialog.isEditMode
      ? await crud.update(dialog.editingConfig.id, dialog.formData)
      : await crud.create(dialog.formData);

    if (success) dialog.close();
  };

  return (
    // 400行UI代码(完全不变)
  );
}
```

## 重构成果

- **代码量减少**: ModelConfigList从630行减少到458行,减少27%
- **逻辑分离**: 所有业务逻辑提取到独立的hooks中
- **易于测试**: hooks可以独立测试
- **复用性**: 通用hooks可在多个组件中复用
- **类型安全**: 完整的TypeScript类型定义

## Facesim模块Hooks

### useCamera

管理摄像头的启动、停止和资源清理。

```tsx
import { useCamera } from "@/hooks/facesim";

const { isCameraActive, videoRef, startCamera, stopCamera, error } = useCamera();

<button onClick={startCamera}>打开摄像头</button>
<video ref={videoRef} autoPlay playsInline />
<button onClick={stopCamera}>关闭摄像头</button>
```

### usePhotoCapture

从视频流中捕获照片并转换为File对象。

```tsx
import { usePhotoCapture } from "@/hooks/facesim";

const { videoRef } = useCamera();
const { capture, capturing } = usePhotoCapture({
  videoRef,
  onCapture: (file) => {
    console.log("拍照完成", file);
  },
});

<button onClick={capture} disabled={capturing}>拍照</button>
```

### useFileUpload

管理文件选择和上传。

```tsx
import { useFileUpload } from "@/hooks/facesim";

const { fileInputRef, handleFileSelect, triggerFileSelect } = useFileUpload({
  onUpload: (file) => {
    console.log("文件选择完成", file);
  },
  accept: "image/*",
});

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleFileSelect}
  className="hidden"
/>
<button onClick={triggerFileSelect}>选择图片</button>
```

## Brandguard模块Hooks

### useComplianceCheck

封装内容合规检测逻辑,支持防抖和自动检测。

```tsx
import { useComplianceCheck } from "@/hooks/brandguard";

const { result, checking, checkCompliance } = useComplianceCheck(content, {
  debounceDelay: 500,
});

// 自动检测会在输入停止500ms后触发
// 也可以手动触发
await checkCompliance(content);
```

### usePosterEditor

封装海报编辑和生成逻辑。

```tsx
import { usePosterEditor } from "@/hooks/brandguard";

const {
  content,
  setContent,
  preview,
  generating,
  generatePoster,
} = usePosterEditor({
  template: selectedTemplate,
  onSuccess: (imageUrl) => {
    console.log("生成成功", imageUrl);
  },
});

<textarea value={content} onChange={(e) => setContent(e.target.value)} />
<button onClick={generatePoster} disabled={generating}>
  {generating ? "生成中..." : "生成海报"}
</button>
{preview && <img src={preview} alt="预览" />}
```

## 待完成的工作

剩余模块的hooks可以按照相同的模式创建:

1. **Facesim模块**: ✅ 已完成
   - useCamera.ts - 摄像头操作
   - usePhotoCapture.ts - Canvas拍照
   - useFileUpload.ts - 文件上传

2. **Brandguard模块**: ✅ 已完成
   - useComplianceCheck.ts - 合规检测
   - usePosterEditor.ts - 海报编辑器

3. **组件重构**: 可选
   - 参考ModelConfigList的重构模式
   - 保持UI结构不变,只替换业务逻辑为hooks调用

## 全部完成的hooks清单

### 通用hooks (4个)
- ✅ useAsyncOperation - 通用异步操作
- ✅ usePagination - 通用分页
- ✅ useDialog - 通用对话框
- ✅ useDebounce - 防抖

### Admin模块 (4个)
- ✅ useModelConfigList - 模型配置列表
- ✅ useModelConfigDialog - 创建/编辑对话框
- ✅ useModelConfigCRUD - CRUD操作
- ✅ useDeleteDialog - 删除确认

### Poster-gen模块 (3个)
- ✅ useImageGeneration - 图片生成
- ✅ useProviderSelector - Provider选择
- ✅ useGenerationHistory - 历史记录

### Facesim模块 (3个)
- ✅ useCamera - 摄像头操作
- ✅ usePhotoCapture - Canvas拍照
- ✅ useFileUpload - 文件上传

### Brandguard模块 (2个)
- ✅ useComplianceCheck - 合规检测
- ✅ usePosterEditor - 海报编辑器

### Auth模块 (1个)
- ✅ useAuth - 认证登录

**总计: 17个自定义hooks**
