import { autorun } from "../helpers/reactivity.js";
import __h from "../helpers/html.js";

const { text, div, button } = __h;

export default function ButtonWidget(scope, props) {
  const textEl = text();

  const autoLabel = (newVal) => {
    if (typeof newVal !== "string") return;
    scope.label = newVal;
    textEl.textContent = scope.label;
  };

  if (props.label.startsWith("{{")) {
    autorun(props.label, autoLabel);
  } else {
    scope.label = props.label;
    textEl.textContent = scope.label;
  }

  return div({ style: "margin:20px 0;" }, [
    button({ onclick: props.onClick }, [textEl]),
  ]);
}
