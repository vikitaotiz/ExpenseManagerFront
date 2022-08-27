import print from "print-js";

export const exportDataToPdf = (data, columns) => {
  printJS({
    printable: data,
    properties: columns,
    type: "json",
    gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
    gridStyle: "border: 2px solid #3971A5;",
  });
};
