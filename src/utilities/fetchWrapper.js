import { baseUrl, headers } from "./constants";

/* Auth methods */
const getAll = async (url, token) => {
  headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}/${url}`, { headers });
  const result = await res.json();

  return result.data;
};

const getSingle = async (url, slug) => {
  const res = await fetch(`${baseUrl}/${url}/${slug}`, { headers });
  const result = await res.json();
  return result;
};

const post = async (url, data) => {
  const res = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  const result = await res.json();
  return result;
};

export { getAll, getSingle, post };
