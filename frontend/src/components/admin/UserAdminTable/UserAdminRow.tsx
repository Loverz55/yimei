import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  UserListData,
  UserRoleLabel,
  UserRolePermissions,
} from "@/type/user";
import dayjs from "dayjs";

interface Props {
  user: UserListData;
  onEdit: (user: UserListData) => void;
}

export default function UserAdminRow({ user, onEdit }: Props) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.loginId}</TableCell>
      <TableCell>{user.nickname || "-"}</TableCell>
      <TableCell>{UserRoleLabel[user.role] || "未知"}</TableCell>
      <TableCell>{UserRolePermissions[user.role] || "-"}</TableCell>
      <TableCell>{dayjs(user.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
          编辑
        </Button>
      </TableCell>
    </TableRow>
  );
}
