class SliderVariable {
  constructor(name, options = {}) {
    const {
      value = 0,
      min = 0,
      max = 100,
      step = 1,
      sliderId = "",
      sliderClassList = [],
      displayId = "",
      displayClassList = [],
    } = options;

    this._name = name;
    this._val = value;
    this._callbacks = [];

    //create slider element
    const slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", min.toString());
    slider.setAttribute("max", max.toString());
    slider.setAttribute("value", value.toString());
    slider.setAttribute("step", step.toString());
    if (sliderId) slider.setAttribute("id", sliderId);
    sliderClassList.forEach((c) => slider.classList.add(c));

    //create display element
    const display = document.createElement("p");
    display.innerText = `${name}: ${value}`;
    if (displayId) display.setAttribute("id", displayId);
    displayClassList.forEach((c) => display.classList.add(c));

    //set listener
    slider.onchange = (e) => {
      this._val = parseInt(e.target.value);
      this._display.innerText = `${this._name}: ${this._val}`;
      this._callbacks.forEach((c) => c(this._val));
    };

    this._slider = slider;
    this._display = display;
  }

  subscribe(callback) {
    this._callbacks.push(callback);
  }

  get slider() {
    return this._slider;
  }

  get display() {
    return this._display;
  }

  get value() {
    return this._val;
  }
}

//always false when initialised
class ToggleVariable {
  constructor(name, options = {}) {
    const {
      on = false,
      buttonId = "",
      buttonClassList = [],
      displayId = "",
      displayClassList = [],
    } = options;

    this._name = name;
    this._on = on;
    this._callbacks = [];

    //create button
    const button = document.createElement("button");
    button.setAttribute("id", buttonId);
    buttonClassList.forEach((c) => button.classList.add(c));
    button.innerText = `${name}: OFF`;

    //create display
    const display = document.createElement("p");
    display.innerText = `${name}: OFF`;
    if (displayId) display.setAttribute("id", displayId);
    displayClassList.forEach((c) => display.classList.add(c));

    button.onclick = (e) => {
      this._on = !this._on;
      this._callbacks.forEach((c) => c(this._on));
      const txt = `${this._name}: ${this._on ? "ON" : "OFF"}`;
      this._button.innerText = txt;
      this._display.innerText = txt;
    };

    this._button = button;
    this._display = display;
  }

  subscribe(callback) {
    this._callbacks.push(callback);
  }

  get button() {
    return this._button;
  }

  get display() {
    return this._display;
  }

  get on() {
    return this._on;
  }
}

class RadioVariable {
  constructor(name, options = {}) {
    const {
      value = null,
      buttonClassList = [],
      displayId = "",
      displayClassList = [],
    } = options;

    this._name = name;
    this._callbacks = [];
    this._value = value;
    this._buttonClassList = buttonClassList;

    //create display
    const display = document.createElement("p");
    display.innerText = `${name}: ${this._value}`;
    if (displayId) display.setAttribute("id", displayId);
    displayClassList.forEach((c) => display.classList.add(c));

    this._display = display;
  }

  subscribe(callback) {
    this._callbacks.push(callback);
  }

  getNewButton(name, value) {
    const button = document.createElement("button");
    this._buttonClassList.forEach((c) => button.classList.add(c));
    button.innerText = name;

    button.onclick = (e) => {
      this._value = value;
      this._display.innerText = `${this._name}: ${this._value}`;
    };

    return button;
  }

  get display() {
    return this._display;
  }

  get value() {
    return this._value;
  }
}
