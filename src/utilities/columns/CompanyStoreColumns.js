export const company_store_columns = [
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
    name: "company",
    align: "center",
    label: "Company",
    field: "company",
    sortable: true,
  },
  {
    name: "product_count",
    align: "center",
    label: "Number of products",
    field: "product_count",
    sortable: true,
  },
  {
    name: "description",
    align: "center",
    label: "Description",
    field: "description",
    sortable: true,
  },
  {
    name: "created_at",
    label: "Created On",
    field: "created_at",
    sortable: true,
  },
  { name: "action", label: "Action" },
];
