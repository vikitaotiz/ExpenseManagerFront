export const storageId = "exp-user";

export const baseUrl = "http://localhost:8000/api/v1";

const store_data = localStorage.getItem(storageId);
const token = JSON.parse(store_data)?.token;

export const headers = {
  "Content-type": "application/json",
  Authorization: `Bearer ${token}`,
};
