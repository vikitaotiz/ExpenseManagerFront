import { useUserStore } from "src/stores/user-store";
import { baseUrl, headers, storageId } from "src/utilities/constants";

const auth = JSON.parse(localStorage.getItem(storageId));
headers.Authorization = `Bearer ${auth?.token}`;

export const fetchData = async (exp_url) => {
  if (!auth?.token) {
    const userStore = useUserStore();
    headers.Authorization = `Bearer ${userStore?.user?.token}`;
  }

  const res = await fetch(`${baseUrl}/${exp_url}`, { headers });
  const results = await res.json();
  return results.data;
};

export const createNewEntry = async (data) => {
  if (!auth?.token) {
    const userStore = useUserStore();
    headers.Authorization = `Bearer ${userStore?.user?.token}`;
  }
  data.user_id = auth?.user?.id;
  data.company_id = auth?.user?.company_id;

  const res = await fetch(`${baseUrl}/entries`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
};

export const deleteData = async (id, exp_url) => {
  if (!auth?.token) {
    const userStore = useUserStore();
    headers.Authorization = `Bearer ${userStore?.user?.token}`;
  }
  const res = await fetch(`${baseUrl}/${exp_url}/${id}`, {
    method: "DELETE",
    headers,
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

export const combineCodeNumber = (phoneNumber, country) => {
  let phone = null;
  if (phoneNumber.value.split("")[0] === "0") {
    phone =
      country.value.dial_code +
      phoneNumber.value
        .split("")
        .filter((v) => v !== "0")
        .join("");
  } else phone = country.value.dial_code + phoneNumber.value;
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
