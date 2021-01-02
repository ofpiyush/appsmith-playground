export class Dep {
  static target;
  static enabled;
  constructor() {
    this.subs = new Set();
  }
  static enable() {
    Dep.enabled = true;
  }

  static disable() {
    Dep.enabled = false;
  }
  addSub(sub) {
    this.subs.add(sub);
  }
  depend(prop) {
    if (Dep.target && Dep.enabled) {
      Dep.target.addDep(this);
    }
  }
  notify() {
    this.subs.forEach((s) => s.update());
  }
}
const targetStack = [];

function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop();
}

class Watcher {
  constructor(getter, cb) {
    this.getter = getter;
    this.cb = cb;
    this.value = this.get();
    this.cb(this.value, null);
  }

  get = () => {
    pushTarget(this);
    const value = this.getter();
    popTarget();

    return value;
  };

  addDep = (dep) => {
    dep.addSub(this);
  };

  update = () => {
    const value = this.get();
    const oldValue = this.value;
    this.value = value;
    this.cb(value, oldValue);
  };
}

const Proxied = new WeakSet();

export function dynamic(obj) {
  // Ignore if already proxied
  if (Proxied.has(obj)) {
    return obj;
  }
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== null && typeof obj[k] == "object") {
      obj[k] = dynamic(obj[k]);
    }
  });
  Proxied.add(obj);

  const dep = new Dep();
  const handler = {
    get: function (target, prop, receiver) {
      dep.depend(prop);
      return target[prop];
    },
    set: function (target, prop, value) {
      if (value !== null && typeof value == "object") {
        value = dynamic(value);
      }
      target[prop] = value;
      dep.notify();
      return true;
    },
  };

  return new Proxy(obj, handler);
}

function boundCallback(scope) {
  return (binding, callback) => {
    const re = /{{(.*)}}/;
    const key = binding.match(re)[1];

    const fn = Function(`
    const [${Object.keys(scope).join(",")}] = arguments;
    this.enable();
    const result = ${key};
    this.disable();
    return result;
    `);
    new Watcher(() => {
      try {
        return fn.apply(Dep, Object.values(scope));
      } catch (e) {
        console.error(e);
      }
    }, callback);
  };
}

export let autorun = () => {};

export function autobind(SCOPE) {
  autorun = boundCallback(SCOPE);
}
