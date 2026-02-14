import { UserListData, UserRoleLabel } from "@/type/user";
import { TableRow, TableCell } from "@/components/ui/table";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { userEditInfoAtom, userInfoEditDialogStatusAtom } from "@/store/admin";

export default function UserAdminRow(props: UserListData) {
  const setUserInfoEditDialogStatus = useSetAtom(userInfoEditDialogStatusAtom);
  const setUserEditInfo = useSetAtom(userEditInfoAtom);

  return (
    <TableRow className="p-2">
      <TableCell className="font-medium">{props.loginId}</TableCell>
      <TableCell>{props.nickname}</TableCell>
      <TableCell>{UserRoleLabel[props.role] || "未知"}</TableCell>
      <TableCell>{dayjs(props.createdAt).format("YYYY-MM-DD HH:mm")}</TableCell>
      <Button
        onClick={() => {
          setUserInfoEditDialogStatus(true);
          setUserEditInfo(props);
        }}
      >
        编辑
      </Button>
    </TableRow>
  );
}
