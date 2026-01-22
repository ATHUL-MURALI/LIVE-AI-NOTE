import api from "./api";

export const saveMessage = async (text) => {
  return await api.post("/save", { text });
};

export const getMessage = async () => {
  return await api.get("/get");
};
