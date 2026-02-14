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
    <div className="flex">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>登录ID</TableHead>
              <TableHead>昵称</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((item) => (
              <UserAdminRow key={item.id} {...item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
