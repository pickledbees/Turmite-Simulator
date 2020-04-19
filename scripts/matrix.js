class CellState {
  static EMPTY = 0;
  static FILL = 1;
}

class Cell {
  constructor(state = CellState.EMPTY) {
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

class CellMatrixPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

class Direction {
  static N = 0;
  static E = 1;
  static S = 2;
  static W = 3;

  static get RANDOM() {
    return Math.floor(Math.random() * 4);
  }

  static clockwise(direction) {
    return (direction + 1) % 4;
  }

  static counterClockwise(direction) {
    return (direction + 3) % 4;
  }

  static invert(direction) {
    return (direction + 2) % 4;
  }
}
