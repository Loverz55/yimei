import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserListData, UserRole, UserRolePermissions } from "@/type/user";
import { useEffect, useState } from "react";

interface FormData {
  loginId: string;
  nickname: string;
  role: UserRole;
  password: string;
}

interface Props {
  open: boolean;
  mode: "create" | "edit";
  user: UserListData | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    loginId: string;
    nickname: string;
    role: UserRole;
    password?: string;
  }) => Promise<boolean>;
}

const defaultFormData: FormData = {
  loginId: "",
  nickname: "",
  role: UserRole.User,
  password: "",
};

export default function UserInfoEditDialog({
  open,
  mode,
  user,
  submitting,
  onOpenChange,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    if (open && mode === "edit" && user) {
      setFormData({
        loginId: user.loginId,
        nickname: user.nickname || "",
        role: user.role,
        password: "",
      });
      return;
    }

    if (open && mode === "create") {
      setFormData(defaultFormData);
    }
  }, [mode, open, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      loginId: formData.loginId,
      nickname: formData.nickname,
      role: formData.role,
      password: formData.password || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "新建用户" : "编辑用户"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "创建后台可登录用户并设置权限。"
              : "修改用户信息和权限；密码留空表示不变更。"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="loginId">登录 ID</Label>
            <Input
              id="loginId"
              value={formData.loginId}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, loginId: event.target.value }))
              }
              placeholder="例如：operator_01"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">昵称</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, nickname: event.target.value }))
              }
              placeholder="例如：咨询顾问A"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label>角色权限</Label>
            <Select
              value={String(formData.role)}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: Number(value) as UserRole }))
              }
              disabled={submitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(UserRole.User)}>
                  普通用户 - {UserRolePermissions[UserRole.User]}
                </SelectItem>
                <SelectItem value={String(UserRole.Doctor)}>
                  医生 - {UserRolePermissions[UserRole.Doctor]}
                </SelectItem>
                <SelectItem value={String(UserRole.Admin)}>
                  管理员 - {UserRolePermissions[UserRole.Admin]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {mode === "create" ? "密码" : "新密码（可选）"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder={mode === "create" ? "请输入密码" : "留空不修改"}
              disabled={submitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "提交中..." : mode === "create" ? "创建" : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
