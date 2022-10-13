export const today_purchases_columns = [
  {
    name: "product",
    required: true,
    label: "Product",
    align: "left",
    field: (row) => row.product,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "measurement",
    label: "Measurement",
    field: "measurement",
    sortable: true,
  },
  {
    name: "quantity",
    label: "Quantity Bought",
    field: "quantity",
    sortable: true,
  },
  {
    name: "issued",
    label: "Quantity Issued",
    field: "issued",
    sortable: true,
  },
  {
    name: "opening_stock",
    label: "Opening Stock",
    field: "opening_stock",
    sortable: true,
  },
  {
    name: "unit_price",
    label: "Unit Price",
    field: "unit_price",
    sortable: true,
  },
  {
    name: "total_amount",
    label: "Total Amount",
    field: "total_amount",
    sortable: true,
  },
  {
    name: "balance",
    label: "Balance",
    field: "balance",
    sortable: true,
  },
  {
    name: "payment_mode",
    label: "Payment Mode",
    field: "payment_mode",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
  },
];
