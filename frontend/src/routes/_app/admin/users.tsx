import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { createFileRoute } from "@tanstack/react-router";

function AdminUsersPage() {
  return (
    <div className="container mx-auto max-w-7xl px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
        <p className="mt-2 text-muted-foreground">
          管理系统用户，支持新建、编辑和分页查询。
        </p>
      </div>

      <AdminUsersTable />
    </div>
  );
}

export const Route = createFileRoute("/_app/admin/users")({
  component: AdminUsersPage,
});
