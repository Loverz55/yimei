import { UserListData } from "@/type/user";
import { atom } from "jotai";

export const userInfoEditDialogStatusAtom = atom(false);
export const userEditInfoAtom = atom<UserListData>();
