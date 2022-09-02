export const ingredient_columns = [
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
    name: "buying_price",
    label: "Buying Price Per Quantity",
    field: "buying_price",
    sortable: true,
  },
  {
    name: "input_unit",
    label: "Input measurement",
    field: "input_unit",
    sortable: true,
  },
  {
    name: "processing_unit",
    label: "Processing measurement",
    field: "processing_unit",
    sortable: true,
  },
  { name: "quantity", label: "Quantity", field: "quantity", sortable: true },
  {
    name: "total_cost",
    label: "Total Cost",
    field: "total_cost",
    sortable: true,
  },
  { name: "store", label: "Store", field: "store", sortable: true },
  { name: "company", label: "Company", field: "company", sortable: true },
  {
    name: "created_at",
    label: "Created On",
    field: "created_at",
    sortable: true,
  },
  { name: "action", label: "Action", align: "center" },
];
