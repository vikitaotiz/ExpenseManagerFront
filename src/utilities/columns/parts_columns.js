export const parts_columns = [
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
    name: "created_at",
    label: "Created On",
    field: "created_at",
    sortable: true,
  },
];
