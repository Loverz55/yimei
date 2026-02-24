import useUserAdminTable from "@/hooks/admin/useUserAdmin";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import UserAdminRow from "./UserAdminTable/UserAdminRow";
import UserInfoEditDialog from "./UserAdminTable/UserInfoEditDialog";

export default function AdminUsersTable() {
  const {
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
  } = useUserAdminTable();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">用户列表</h3>
          <p className="text-sm text-muted-foreground">
            总计 {pagination?.total ?? userList.length} 个用户
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => getUserList(page, pageSize)}>
            刷新
          </Button>
          <Button onClick={openCreateDialog}>新建用户</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>登录 ID</TableHead>
              <TableHead>昵称</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>权限</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user) => (
              <UserAdminRow key={user.id} user={user} onEdit={openEditDialog} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {loading && (
        <p className="text-sm text-muted-foreground">正在加载用户数据...</p>
      )}

      {!loading && userList.length === 0 && (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          当前没有用户数据。
        </Card>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span>每页</span>
            <select
              className="h-9 rounded-md border bg-background px-2"
              value={pageSize}
              onChange={(event) => changePageSize(Number(event.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>条</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
            >
              上一页
            </Button>
            <span className="text-sm text-muted-foreground">
              第 {page} / {pagination.totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => changePage(page + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      <UserInfoEditDialog
        open={dialogOpen}
        mode={mode}
        user={editingUser}
        submitting={submitting}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        onSubmit={submitForm}
      />
    </div>
  );
}
