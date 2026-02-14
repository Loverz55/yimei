import { UserListData, UserRoleLabel } from "@/type/user";
import { TableRow, TableCell } from "@/components/ui/table";
import dayjs from "dayjs";

export default function UserAdminRow(props: UserListData) {
  return (
    <TableRow>
      <TableCell className="font-medium">{props.loginId}</TableCell>
      <TableCell>{props.nickname}</TableCell>
      <TableCell>{UserRoleLabel[props.role] || "未知"}</TableCell>
      <TableCell>{dayjs(props.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
    </TableRow>
  );
}
