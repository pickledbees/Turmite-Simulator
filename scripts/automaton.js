//template for automaton
class Automaton {
  constructor(cellMatrix) {
    this._cm = cellMatrix;
    this.alive = true;
  }

  //wrapper method for cell matrix
  _getCell(x, y) {
    return this._cm.getCell(x, y);
  }

  //wrapper method for cell matrix
  _getPos(x, y, direction, distance) {
    return this._cm.getPos(x, y, direction, distance);
  }

  //1st call
  //sets initial occupancy of automaton instance
  spawn() {
    //implemented by child class
  }

  //2nd call
  //decisions made by automaton over here
  //returns render info of updated cells
  //type is Array<{x, y, r, g, b}>
  interact() {
    //implemented by child class
    //update internal state
    //update cell states
  }

  //3rd call
  //called by simulation tick to remove all instances of its occupancy
  die() {
    //implemented by child class
  }

  //4th call
  //exclusively for setting positions
  //returns Array<Automaton> for new automatons spawned
  move() {
    //implemented by child class
    //update position
    //update occupancy
    //return new automatons (if spawned)
  }

  //returns render info of automaton
  //type is Array<{x, y, r, g, b}>
  getColourPoints() {
    //implemented by child class
  }
}

//Represents a single celled automaton (Langton's Ant)
class Ant extends Automaton {
  constructor(x, y, cellMatrix, direction = Direction.W) {
    super(cellMatrix);
    this.pos = { x, y };
    this.direction = direction;
  }

  spawn() {
    this._getCell(this.pos.x, this.pos.y).add(this);
  }

  interact() {
    const { x, y } = this.pos;
    const cell = this._getCell(x, y);

    //allows small ants to die
    if (cell.getAutomatons().length > 1) {
      this.alive = false;
      console.log("Ant smooshed");
    }

    let c;
    if (cell.state === CellState.EMPTY) {
      this.direction = Direction.clockwise(this.direction);
      cell.state = CellState.FILL;
      c = 0;
    } else if (cell.state === CellState.FILL) {
      this.direction = Direction.counterClockwise(this.direction);
      cell.state = CellState.EMPTY;
      c = 255;
    }
    return [{ x, y, r: c, g: c, b: c }];
  }

  die() {
    this._getCell(this.pos.x, this.pos.y).delete(this);
  }

  move() {
    const { x, y } = this.pos;
    this.pos = this._getPos(x, y, this.direction);
    this._getCell(x, y).delete(this);
    this._getCell(this.pos.x, this.pos.y).add(this);
    return [];
  }

  getColourPoints() {
    return [{ ...this.pos, r: 255, g: 0, b: 0 }];
  }
}

//Ant with different walk pattern
class Termite extends Ant {
  constructor(x, y, matrix, direction) {
    super(x, y, matrix, direction);
    this.state = 1;
  }

  interact() {
    const { x, y } = this.pos;
    const cell = this._getCell(x, y);

    if (cell.getAutomatons().length > 2) {
      this.alive = false;
      console.log("termite smooshed");
    }

    let c;
    if (cell.state === CellState.EMPTY) {
      this.direction =
        this.state === 1
          ? Direction.counterClockwise(this.direction)
          : Direction.clockwise(this.direction);
      this.state = 2;
      cell.state = CellState.FILL;
      c = 0;
    } else if (cell.state === CellState.FILL) {
      this.direction = Direction.counterClockwise(this.direction);
      this.state = this.state === 1 ? 2 : 1;
      cell.state = CellState.EMPTY;
      c = 255;
    }
    return [{ ...this.pos, r: c, g: c, b: c }];
  }

  getColourPoints() {
    return [{ ...this.pos, r: 0, g: 0, b: 255 }];
  }
}

class Beetle extends Ant {
  constructor(x, y, matrix, direction) {
    super(x, y, matrix, direction);
    this.state = 1;
  }

  interact() {
    const { x, y } = this.pos;
    const cell = this._getCell(x, y);

    if (cell.getAutomatons().length > 3) {
      this.alive = false;
      console.log("beetle smooshed");
    }

    let c;
    if (cell.state === CellState.EMPTY) {
      this.direction =
        this.state === 1 ? Direction.clockwise(this.direction) : this.direction;
      cell.state = CellState.FILL;
      c = 0;
    } else if (cell.state === CellState.FILL) {
      this.direction =
        this.state === 1
          ? Direction.counterClockwise(this.direction)
          : this.direction;
      cell.state = CellState.EMPTY;
      c = 255;
    }
    this.state = this.state === 1 ? 2 : 1;

    return [{ ...this.pos, r: c, g: c, b: c }];
  }

  getColourPoints() {
    return [{ ...this.pos, r: 0, g: 255, b: 0 }];
  }
}

class Turmite extends Automaton {}

//super-sized version of langton's ant
//occupies 3x3 space
class BigAnt extends Automaton {
  static SIZE = 3;
  static SLOW_FACTOR = 6;

  constructor(x, y, matrix, direction = Direction.W) {
    super(matrix);
    this._t = 0;
    this.pos = { x, y }; //top left
    this.direction = direction;
    this._H = matrix.height;
    this._W = matrix.width;
  }

  _iterateOverOccupiedCells(operation) {
    let Y, X;
    const { x, y } = this.pos;
    for (let oY = 0; oY < BigAnt.SIZE; oY++) {
      for (let oX = 0; oX < BigAnt.SIZE; oX++) {
        X = (x + oX) % this._W;
        Y = (y + oY) % this._H;
        operation(this._getCell(X, Y), X, Y);
      }
    }
  }

  _occupy() {
    this._iterateOverOccupiedCells((cell) => cell.add(this));
  }

  _vacate() {
    this._iterateOverOccupiedCells((cell) => cell.delete(this));
  }

  spawn() {
    this._occupy();
  }

  interact() {
    this._t = (this._t + 1) % BigAnt.SLOW_FACTOR;

    if (this._t !== 0) {
      return [];
    }

    let p = 0;
    this._iterateOverOccupiedCells(
      (cell) => (p += cell.state === CellState.EMPTY ? 1 : -1)
    );
    let newState;
    let c;
    if (p > 0) {
      this.direction = Direction.clockwise(this.direction);
      newState = CellState.FILL;
      c = 0;
    } else {
      this.direction = Direction.counterClockwise(this.direction);
      newState = CellState.EMPTY;
      c = 255;
    }
    let updated = [];
    this._iterateOverOccupiedCells((cell, x, y) => {
      cell.state = newState;
      updated.push({ x, y, r: c, g: c, b: c });
    });
    return updated;
  }

  die() {
    this._vacate();
  }

  move() {
    if (this._t !== 0) {
      return [];
    }

    this._vacate();
    this.pos = this._getPos(
      this.pos.x,
      this.pos.y,
      this.direction,
      BigAnt.SIZE
    );
    this._occupy();

    return [];
  }

  getColourPoints() {
    let points = [];
    this._iterateOverOccupiedCells((_, x, y) =>
      points.push({ x, y, r: 150, g: 0, b: 0 })
    );
    return points;
  }
}
