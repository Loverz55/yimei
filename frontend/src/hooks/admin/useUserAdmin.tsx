import { createUserApi, getUserListApi, updateUserApi } from "@/api/user";
import type { PaginationInfo } from "@/type/common";
import type {
  CreateUserDto,
  UpdateUserDto,
  UserListData,
  UserRole,
} from "@/type/user";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type UserFormMode = "create" | "edit";

export interface UserFormPayload {
  loginId: string;
  nickname: string;
  role: UserRole;
  password?: string;
}

export default function useUserAdminTable() {
  const [userList, setUserList] = useState<UserListData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<UserFormMode>("create");
  const [editingUser, setEditingUser] = useState<UserListData | null>(null);

  const getUserList = useCallback(
    async (nextPage = page, nextPageSize = pageSize) => {
      try {
        setLoading(true);
        const res = await getUserListApi({
          page: nextPage,
          pageSize: nextPageSize,
        });

        if (res.code !== 0) {
          toast.error(res.msg || "加载用户列表失败");
          return;
        }

        setUserList(res.data || []);
        setPagination(res.pagination || null);
      } catch {
        toast.error("加载用户列表失败");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize],
  );

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const openCreateDialog = () => {
    setMode("create");
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEditDialog = (user: UserListData) => {
    setMode("edit");
    setEditingUser(user);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const submitForm = async (payload: UserFormPayload) => {
    const loginId = payload.loginId.trim();
    const nickname = payload.nickname.trim();
    const password = payload.password?.trim();

    if (!loginId) {
      toast.error("请输入登录 ID");
      return false;
    }

    if (mode === "create" && !password) {
      toast.error("新建用户时必须填写密码");
      return false;
    }

    try {
      setSubmitting(true);

      if (mode === "create") {
        const body: CreateUserDto = {
          loginId,
          role: payload.role,
          password: password!,
          nickname: nickname || undefined,
        };
        const res = await createUserApi(body);
        if (res.code !== 0) {
          toast.error(res.msg || "创建用户失败");
          return false;
        }
        toast.success("用户创建成功");
      } else if (editingUser) {
        const body: UpdateUserDto = {
          loginId,
          role: payload.role,
          nickname: nickname || undefined,
        };
        if (password) {
          body.password = password;
        }
        const res = await updateUserApi(editingUser.id, body);
        if (res.code !== 0) {
          toast.error(res.msg || "更新用户失败");
          return false;
        }
        toast.success("用户更新成功");
      }

      closeDialog();
      await getUserList(page, pageSize);
      return true;
    } catch {
      toast.error(mode === "create" ? "创建用户失败" : "更新用户失败");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
  };

  const changePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return {
    userList,
    pagination,
    loading,
    submitting,
    page,
    pageSize,
    dialogOpen,
    mode,
    editingUser,
    getUserList,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitForm,
    changePage,
    changePageSize,
  };
}
