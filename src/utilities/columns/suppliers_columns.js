export const suppliers_columns = [
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
    name: "phone",
    align: "center",
    label: "Phone",
    field: "phone",
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
    name: "address",
    align: "center",
    label: "Address",
    field: "address",
    sortable: true,
  },
  {
    name: "created_at",
    label: "Created On",
    field: "created_at",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
  },
];
