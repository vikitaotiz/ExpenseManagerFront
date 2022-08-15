import { storageId, baseUrl, headers } from "./constants";

/* Non auth methods */

const post = async (data, url) => {
  const res = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (res.status === 201)
    localStorage.setItem(storageId, JSON.stringify(result));

  return { status: res.status, result };
};

export { post };
