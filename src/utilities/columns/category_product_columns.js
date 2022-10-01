export const category_product_columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "selling_price",
    label: "Selling Price",
    field: "selling_price",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    sortable: true,
  },
  { name: "company", label: "Company", field: "company", sortable: true },
  { name: "created_at", label: "Time", field: "created_at", sortable: true },
  { name: "action", label: "Action", align: "center" },
];
