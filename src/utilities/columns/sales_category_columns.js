export const sales_category_columns = [
  {
    name: "product",
    required: true,
    label: "Product",
    align: "left",
    field: (row) => row.product,
    format: (val) => `${val}`,
    sortable: true,
  },
  // {
  //   name: "selling_price",
  //   label: "Unit Price",
  //   field: "selling_price",
  //   sortable: true,
  // },

  {
    name: "usaget",
    label: "Quantity",
    field: "usage",
    sortable: true,
  },
  {
    name: "usage_cost",
    label: "Amount",
    field: "usage_cost",
    sortable: true,
  },
];
