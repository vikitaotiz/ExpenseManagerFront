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
    name: "description",
    align: "center",
    label: "Description",
    field: "description",
    sortable: true,
  },
  { name: "unit", label: "Unit", field: "unit", sortable: true },
  { name: "company", label: "Company", field: "company", sortable: true },
  { name: "created_at", label: "Time", field: "created_at", sortable: true },
  { name: "action", label: "Action", align: "center" },
];
