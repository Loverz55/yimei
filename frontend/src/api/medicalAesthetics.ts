import {
  creatMedicalAesthetics,
  medicalAestheticsRespons,
  updateMedicalAesthetics,
} from "@/type/medicalAesthetics";
import { api } from ".";

export const medicalAestheticsListApi = () => {
  return api.get<medicalAestheticsRespons[]>("/api/medical-aesthetics");
};

export const createMedicalAestheticsApi = (data: creatMedicalAesthetics) => {
  return api.post<medicalAestheticsRespons>("/api/medical-aesthetics", data);
};

export const updateMedicalAestheticsApi = (
  id: number,
  data: updateMedicalAesthetics
) => {
  return api.patch<medicalAestheticsRespons>(
    `/api/medical-aesthetics/${id}`,
    data
  );
};

export const deleteMedicalAestheticsApi = (id: string) => {
  return api.delete<medicalAestheticsRespons>(`/api/medical-aesthetics/${id}`);
};
