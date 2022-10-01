export const product_columns = [
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
  { name: "category", label: "Category", field: "category", sortable: true },
  { name: "company", label: "Company", field: "company", sortable: true },
  {
    name: "created_at",
    label: "Created On",
    field: "created_at",
    sortable: true,
  },
  { name: "action", label: "Action", align: "center" },
];
