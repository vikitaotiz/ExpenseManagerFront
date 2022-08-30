import print from "print-js";

const buildHeader = (data, header_title) => {
  const total_usage_cost = data.reduce(
    (a, b) => a + Number(b.selling_price) * Number(b.usage),
    0
  );

  const total_production_cost = data.reduce(
    (a, b) => a + Number(b.unit_price) * Number(b.usage),
    0
  );
  const net_profit = total_usage_cost - total_production_cost;

  const header = `<div style="border: 1px solid grey; paddinng: 5px; margin-bottom: 20px; width: 500px">
  <h1>${header_title}</h1>
  <ul>
    <li>Total Production Cost : ${total_production_cost}</li>
    <li>Total Usage/Sales cost : ${total_usage_cost}</li>
    <li>Net profit : ${net_profit}</li>
    <li>Average Percentage Profit : ${
      net_profit / total_production_cost
        ? ((net_profit / total_production_cost) * 100).toFixed(2)
        : 0
    } %
    </li>
  </ul>
</div>`;
  return header;
};

export const exportDataToPdf = (data, columns, header_title) => {
  const headerSection = buildHeader(data, header_title);
  printJS({
    header: headerSection,
    printable: data,
    properties: columns,
    type: "json",
    gridHeaderStyle: "font-weight: bold; border: 2px solid;",
    gridStyle: "border-collapse: collapse; border: 1px solid;",
  });
};
