const RGB = {
  RED: { r: 255, g: 0, b: 0 },
  BLUE: { r: 0, g: 0, b: 255 },
  YELLOW: { r: 255, g: 255, b: 0 },
  GREEN: { r: 0, g: 255, b: 0 },
  MAGENTA: { r: 255, g: 0, b: 255 },
  CYAN: { r: 0, g: 255, b: 255 },
  ORANGE: { r: 255, g: 255, b: 0 },
  BLACK: { r: 0, g: 0, b: 0 },
  WHITE: { r: 255, g: 255, b: 255 },
};

const Direction = {
  N: 0,
  E: 1,
  S: 2,
  W: 3,
  get RANDOM() {
    return Math.floor(Math.random() * 4);
  },
};

const Rotation = {
  NONE: 0,
  CLOCKWISE: 1,
  COUNTERCLOCKWISE: 3,
  INVERT: 2,
};

function changeDirection(direction, rotation) {
  return (direction + rotation) % 4;
}

function cellStateToRGB(cellState) {
  switch (cellState) {
    case 0:
      return RGB.WHITE;
    case 1:
      return RGB.BLACK;
  }
}

class Cell {
  constructor(state = 0) {
    this.state = state;
    this._a = new Set();
  }

  getAutomatons() {
    return [...this._a];
  }

  add(automaton) {
    this._a.add(automaton);
  }

  delete(automaton) {
    this._a.delete(automaton);
  }

  has(automaton) {
    return this._a.has(automaton);
  }

  clear() {
    this._a.clear();
  }
}

class CellMatrix {
  constructor(w, h) {
    const m = [];
    for (let i = 0; i < h; i++) {
      let r = [];
      for (let j = 0; j < w; j++) {
        r.push(new Cell());
      }
      m.push(r);
    }
    this._w = w;
    this._h = h;
    this._m = m;
  }

  get height() {
    return this._h;
  }

  get width() {
    return this._w;
  }

  setCell(x, y, state) {
    this._m[y][x] = state;
  }

  getCell(x, y) {
    return this._m[y][x];
  }

  getPos(x, y, direction, distance = 1) {
    switch (direction) {
      case Direction.N:
        return { x, y: (y + this._h - distance) % this._h };
      case Direction.S:
        return { x, y: (y + distance) % this._h };
      case Direction.W:
        return { x: (x + this._w - distance) % this._w, y };
      case Direction.E:
        return { x: (x + distance) % this._w, y };
    }
  }
}
