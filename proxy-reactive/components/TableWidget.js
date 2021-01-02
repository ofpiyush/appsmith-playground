import __h from "../helpers/html.js";
const { text, div, table, th, tr, td } = __h;
import { autorun } from "../helpers/reactivity.js";

export default function TableWidget(scope, props) {
  scope.selectedRow = {};
  scope.tableData = [];
  scope.selectedRowIndex = -1;
  let tbl;

  const redraw = () => {
    if (tbl) {
      tbl.remove();
    }
    // React will solve these problems for us
    // We don't need to worry about being efficient with Dom manipulation here.
    tbl = makeTable(scope.tableData, scope.selectedRowIndex, onRowSelected);
    tblDiv.appendChild(tbl);
  };
  const onRowSelected = (i, r) => {
    scope.selectedRow = r;
    scope.selectedRowIndex = i;
    redraw();
  };

  let tblDiv = div(
    {
      style: "margin:20px 0;",
    },
    []
  );

  if (props.tableData && props.tableData.startsWith("{{")) {
    autorun(props.tableData, (newVal) => {
      newVal = Array.isArray(newVal) ? newVal : [];
      scope.tableData = newVal;
      redraw();
    });
  }
  redraw();
  return tblDiv;
}

function makeTable(tableData, selectedRowIndex, onRowSelected) {
  let headers = tableData.length > 0 ? tableData[0] : {};
  let rows = [TableHeaders(headers)];

  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    rows.push(
      TableRow({
        onSelect: () => onRowSelected(i, row),
        selected: selectedRowIndex === i,
        data: row,
      })
    );
  }

  return table({}, rows);
}

function TableHeaders(props) {
  return tr(
    { style: "text-transform:capitalize;" },
    Object.keys(props).map((h) => th({}, [text(h)]))
  );
}

function TableRow(props) {
  return tr(
    {
      onclick: props.onSelect,
      style:
        "cursor: pointer;" + (props.selected ? "background:darkslategray" : ""),
    },
    Object.values(props.data).map((v) => td({}, [text(v)]))
  );
}
