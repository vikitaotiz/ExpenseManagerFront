export const units_columns = [
  {
    name: "title",
    required: true,
    label: "Title",
    align: "left",
    field: (row) => row.title,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "symbol", label: "Symbol", field: "symbol", sortable: true },
  {
    name: "created_at",
    label: "Created On",
    field: "created_at",
    sortable: true,
  },
];
