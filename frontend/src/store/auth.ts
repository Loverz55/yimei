import { User } from "@/type/user";
import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | null>(
  "auth_token", // localStorage key
  null, // 默认值
);

export const userInfoAtom = atomWithStorage<User>("userInfo", {
  userId: 0,
  loginId: "",
  nickname: "",
  role: 0,
});
