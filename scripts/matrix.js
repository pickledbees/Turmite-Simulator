class CellState {
  static WHITE = 0;
  static BLACK = 1;
}

class Cell {
  constructor(state = CellState.WHITE) {
    this.state = state;
    this._a = new Set();
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
      m.push();
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

  getPos(x, y, direction) {
    switch (direction) {
      case Direction.N:
        return { x, y: y === 0 ? this._h - 1 : y - 1 };
      case Direction.S:
        return { x, y: y === this._h - 1 ? 0 : y + 1 };
      case Direction.W:
        return { x: x === 0 ? this._w - 1 : x - 1, y };
      case Direction.E:
        return { x: x === this._w - 1 ? 0 : x + 1, y };
    }
  }
}

class Direction {
  static N = 0;
  static E = 1;
  static S = 2;
  static W = 3;

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
