# 使用react-hook-form优化表单示例

## 新增的Hook: useModelConfigForm

集成了`react-hook-form`和`zod`验证，提供更强大的表单管理能力。

### 优势对比

#### 原有方式 (useModelConfigDialog)
- 手动管理每个字段状态
- 手动编写验证逻辑
- 需要手动处理错误提示

#### 新方式 (useModelConfigForm)
- ✅ 自动表单验证 (zod schema)
- ✅ 内置错误提示
- ✅ 更少的代码
- ✅ 类型安全的表单字段

## 使用示例

### 1. 在组件中使用

```tsx
import { useModelConfigForm } from "@/hooks/admin";

export function ModelConfigList() {
  const list = useModelConfigList();

  // 使用新的form hook替代dialog hook
  const formDialog = useModelConfigForm();

  const crud = useModelConfigCRUD({
    onSuccess: () => list.reload(),
  });

  const handleSubmit = async () => {
    // 验证表单
    const isValid = await formDialog.form.trigger();
    if (!isValid) return;

    // 获取表单数据
    const formData = formDialog.getFormData();

    let success: boolean;
    if (formDialog.isEditMode && formDialog.editingConfig) {
      success = await crud.update(formDialog.editingConfig.id, formData);
    } else {
      success = await crud.create(formData);
    }

    if (success) {
      formDialog.close();
    }
  };

  return (
    <Dialog open={formDialog.isOpen} onOpenChange={formDialog.close}>
      <DialogContent>
        <form onSubmit={formDialog.form.handleSubmit(handleSubmit)}>
          {/* 表单字段 - 使用react-hook-form */}
          <div className="grid gap-4">
            {/* 配置名称 */}
            <div>
              <Label>配置名称 *</Label>
              <Input
                {...formDialog.form.register("name")}
                placeholder="例如：OpenAI DALL-E 3"
              />
              {formDialog.form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {formDialog.form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Provider类型 */}
            <div>
              <Label>Provider类型 *</Label>
              <select
                {...formDialog.form.register("provider")}
                className="flex h-10 w-full rounded-md border"
              >
                <option value="openai">OpenAI</option>
                <option value="stability">Stability AI</option>
                <option value="aliyun">阿里云</option>
                <option value="gemini">Google Gemini</option>
              </select>
            </div>

            {/* API基础URL */}
            <div>
              <Label>API基础URL *</Label>
              <Input
                {...formDialog.form.register("baseUrl")}
                placeholder="https://api.openai.com/v1"
              />
              {formDialog.form.formState.errors.baseUrl && (
                <p className="text-sm text-red-500">
                  {formDialog.form.formState.errors.baseUrl.message}
                </p>
              )}
            </div>

            {/* API Key */}
            <div>
              <Label>API Key *</Label>
              <Input
                type="password"
                {...formDialog.form.register("apiKey")}
                placeholder="sk-..."
              />
              {formDialog.form.formState.errors.apiKey && (
                <p className="text-sm text-red-500">
                  {formDialog.form.formState.errors.apiKey.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={formDialog.close}>
              取消
            </Button>
            <Button type="submit" disabled={crud.submitting}>
              {formDialog.isEditMode ? "更新" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 2. 验证Schema

在`useModelConfigForm`中定义的zod schema:

```typescript
const modelConfigSchema = z.object({
  name: z.string().min(1, "配置名称不能为空"),
  provider: z.enum(["openai", "stability", "aliyun", "gemini"]),
  type: z.enum(["image-gen", "text-gen", "embedding"]).optional(),
  modelId: z.string().optional(),
  baseUrl: z.string().min(1, "API基础URL不能为空").url("请输入有效的URL"),
  apiKey: z.string().min(1, "API Key不能为空"),
  enabled: z.boolean().optional(),
  priority: z.number().int().optional(),
  description: z.string().optional(),
});
```

## 代码对比

### 原有方式
```tsx
// 需要手动管理状态
const [formData, setFormData] = useState({...});
const updateField = (key, value) => {
  setFormData(prev => ({ ...prev, [key]: value }));
};

// 需要手动验证
const handleSubmit = async () => {
  if (!formData.name) {
    toast.error("配置名称不能为空");
    return;
  }
  if (!formData.apiKey) {
    toast.error("API Key不能为空");
    return;
  }
  // ... 更多验证
};

// 使用
<Input
  value={formData.name}
  onChange={(e) => updateField("name", e.target.value)}
/>
```

### 新方式 (react-hook-form)
```tsx
// react-hook-form自动管理状态和验证
const form = useForm({
  resolver: zodResolver(modelConfigSchema),
});

// 验证自动处理
const handleSubmit = form.handleSubmit(async (data) => {
  // data已经验证通过
  await crud.create(data);
});

// 使用
<Input {...form.register("name")} />
{form.formState.errors.name && (
  <p>{form.formState.errors.name.message}</p>
)}
```

## 优势总结

1. **更少的代码**: 不需要手动管理每个字段的state
2. **自动验证**: zod schema自动验证,无需手动if判断
3. **类型安全**: TypeScript完全推断表单字段类型
4. **性能更好**: react-hook-form使用非受控组件,减少re-render
5. **错误提示**: 内置错误状态管理
6. **易于扩展**: 添加新字段只需在schema中定义

## 迁移建议

可以选择性迁移:
- **保持现有**: `useModelConfigDialog` 仍然可用,简单场景足够
- **新项目推荐**: 使用 `useModelConfigForm` 获得更好的体验
- **复杂表单**: 多字段、复杂验证的场景强烈推荐使用react-hook-form
