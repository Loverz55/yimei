import { GetUserListApi } from "@/api/user";
import { UserListData } from "@/type/user";
import { useEffect, useState } from "react";

export default function useUserAdminTable() {
  const [userList, setUserList] = useState<UserListData[]>([]);

  const getUserList = async () => {
    const res = await GetUserListApi();
    if (res.data) {
      setUserList(res.data);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  return {
    userList,
    getUserList,
  };
}
