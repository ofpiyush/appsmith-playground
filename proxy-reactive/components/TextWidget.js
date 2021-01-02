import { autorun } from "../helpers/reactivity.js";
import __h from "../helpers/html.js";

const { text, span } = __h;

export default function TextWidget(scope, props) {
  const textEl = text("");
  const spanEl = span({}, [textEl]);

  const redraw = (val) => {
    scope.text = val;
    textEl.textContent = scope.text;
    if (scope.text && scope.text.length) {
      spanEl.style = props.style;
    }
  };

  const autoText = (newVal) => {
    if (typeof newVal !== "string") return;
    redraw(newVal);
  };

  if (props.value.startsWith("{{")) {
    autorun(props.value, autoText);
  } else {
    redraw(props.value);
  }

  return spanEl;
}
