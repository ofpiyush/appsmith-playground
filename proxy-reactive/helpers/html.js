// Quickly hacked together to keep my sanity.
function createElement(tag, attributes, children) {
  attributes = attributes || {};
  children = children || [];
  const el = document.createElement(tag);
  Object.assign(el, attributes);

  children.forEach((c) => el.appendChild(c));
  return el;
}

function text(value) {
  return document.createTextNode(value);
}

const TAGS = ["div", "span", "input", "button", "table", "th", "tr", "td"];
const exports = {
  text,
};

TAGS.forEach((tag) => {
  exports[tag] = (attributes, children) =>
    createElement(tag, attributes, children);
});

export default exports;
