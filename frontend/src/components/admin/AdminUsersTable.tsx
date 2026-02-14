import useUserAdminTable from "@/hooks/admin/useUserAdmin";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import UserAdminRow from "./UserAdminTable/UserAdminRow";

export default function AdminUsersTable() {
  const { userList } = useUserAdminTable();

  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>登录ID</TableHead>
              <TableHead>昵称</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {userList.map((item) => (
              <UserAdminRow key={item.id} {...item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
