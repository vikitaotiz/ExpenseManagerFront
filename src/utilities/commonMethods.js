import { useUserStore } from "src/stores/user-store";
import { baseUrl, headers, storageId } from "src/utilities/constants";

const getHeaders = () => {
  const userStore = useUserStore();
  headers.Authorization = `Bearer ${userStore?.user?.token}`;
  return headers;
};

export const fetchData = async (exp_url) => {
  const res = await fetch(`${baseUrl}/${exp_url}`, { headers: getHeaders() });
  if (res?.status === 200) {
    const results = await res.json();
    return results.data;
  } else {
    localStorage.removeItem(storageId);
    location.reload();
  }
};

export const createNewEntry = async (data, user) => {
  data.user_id = user.id;
  data.company_id = user.company_id;

  const res = await fetch(`${baseUrl}/entries`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
};

export const deleteData = async (id, exp_url) => {
  const res = await fetch(`${baseUrl}/${exp_url}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const result = await res.json();
  return result;
};

export const filterCategoryProducts = (search_products, category_products) => {
  if (search_products) {
    return category_products.filter((item) => {
      return search_products
        .toLowerCase()
        .split(" ")
        .every((v) => item.name.toLowerCase().includes(v));
    });
  } else {
    return category_products;
  }
};

export const validatePhone = (input_str) => {
  let re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(input_str);
};

export const filterCountries = (val, update, options, country_data) => {
  if (val === "") {
    update(() => (options.value = country_data));
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = country_data.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

export const combineCodeNumber = (phoneNumber, dial_code) => {
  let phone = null;
  if (phoneNumber.split("")[0] === "0") {
    phone =
      dial_code +
      phoneNumber
        .split("")
        .filter((v) => v !== "0")
        .join("");
  } else phone = dial_code + phoneNumber;
  return phone;
};

export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const notifyUser = (q, message, position, color, actions = []) => {
  q.notify({
    message,
    color,
    position,
    actions,
  });
};
