import { dynamic, autobind } from "./helpers/reactivity.js";
import widgetMap from "./components/index.js";
import __h from "./helpers/html.js";

const { div } = __h;

const SCOPE = dynamic({
  Api1: { data: [] },
});

autobind(SCOPE);

function Canvas() {
  const widgets = [];
  Object.keys(state.widgets).forEach((k) => {
    const value = state.widgets[k];
    SCOPE[k] = {};
    const fn = widgetMap[value.WIDGET_TYPE];
    widgets.push(fn(SCOPE[k], value.props));
  });
  return div({}, widgets);
}

let counter = 0;
const state = {
  widgets: {
    Table1: {
      WIDGET_TYPE: "TABLE",
      props: {
        tableData: "{{Api1.data}}",
      },
    },
    Text2: {
      WIDGET_TYPE: "TEXT",
      props: {
        value: "Selected User: ",
      },
    },
    Text1: {
      WIDGET_TYPE: "TEXT",
      props: {
        style: "background:darkkhaki; padding:2px 5px; color: black;",
        value: "{{Table1.selectedRow.email}}",
      },
    },
    Button1: {
      WIDGET_TYPE: "BUTTON",
      props: {
        label: "Call API to add user",
        onClick: () => {
          // Simulate an api call that takes 500ms
          setTimeout(() => {
            counter++;
            let dt = SCOPE.Api1.data;
            dt.push({
              user: `user_${counter}`,
              email: `user_${counter}@example.com`,
            });
            // Arrays are solvable, but this is a demo, so we rely on assignment
            SCOPE.Api1.data = dt;
          }, 500);
        },
      },
    },
  },
};

window.main = (root) => {
  root.appendChild(Canvas());
};
