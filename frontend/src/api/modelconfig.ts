import { api } from ".";

export const modelListApi = () => {
  return api.get("/api/modelconfig");
};
