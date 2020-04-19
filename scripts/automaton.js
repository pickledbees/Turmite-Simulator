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
    //update internal _s
    //update cell states
  }

  //3rd call
  //called by simulation tick to remove all instances of its occupancy
  dispose() {
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

//RuleSet shape
//rs[cellState][miteState] = {c, s, r}
//rule set is 2 dimensional state transition matrix
//c: new state of cell
//s: new state of mite
//r: rotation of mite

const ANT = [
  [{ c: 1, s: 0, r: Rotation.CLOCKWISE }],
  [{ c: 0, s: 0, r: Rotation.COUNTERCLOCKWISE }],
];

const TERMITE = [
  [
    { c: 1, s: 1, r: Rotation.CLOCKWISE },
    { c: 1, s: 0, r: Rotation.NONE },
  ],
  [
    { c: 0, s: 1, r: Rotation.CLOCKWISE },
    { c: 1, s: 1, r: Rotation.NONE },
  ],
];

const BEETLE = [
  [
    { c: 1, s: 1, r: Rotation.CLOCKWISE },
    { c: 1, s: 0, r: Rotation.NONE },
  ],
  [
    { c: 0, s: 1, r: Rotation.COUNTERCLOCKWISE },
    { c: 0, s: 0, r: Rotation.NONE },
  ],
];

const SPIDER = [
  [
    { c: 1, s: 1, r: Rotation.COUNTERCLOCKWISE },
    { c: 1, s: 1, r: Rotation.CLOCKWISE },
  ],
  [
    { c: 0, s: 1, r: Rotation.COUNTERCLOCKWISE },
    { c: 0, s: 0, r: Rotation.COUNTERCLOCKWISE },
  ],
];

//Represents a simple Turing Mite
class Turmite extends Automaton {
  constructor(x, y, matrix, ruleSet, colour, direction = Direction.W) {
    super(matrix);
    this._p = { x, y };
    this._d = direction;
    this._s = 0;
    this._c = colour;
    this._rs = ruleSet;
  }

  spawn() {
    this._getCell(this._p.x, this._p.y).add(this);
    const that = this;
  }

  interact() {
    const cell = this._getCell(this._p.x, this._p.y);

    if (cell.getAutomatons().length > 1) this.alive = false;

    const { c, s, r } = this._rs[cell.state][this._s];
    cell.state = c;
    this._s = s;
    this._d = changeDirection(this._d, r);
    const rgb = cellStateToRGB(cell.state);
    return [{ ...this._p, ...rgb }];
  }

  dispose() {
    this._getCell(this._p.x, this._p.y).delete(this);
  }

  move() {
    this.dispose();
    this._p = this._getPos(this._p.x, this._p.y, this._d);
    this.spawn();
    return [];
  }

  getColourPoints() {
    return [{ ...this._p, ...this._c }];
  }
}

//super-sized version of langton's ant
//occupies 3x3 space
class BigAnt extends Automaton {
  constructor(x, y, matrix, direction = Direction.W) {
    super(matrix);
    this._t = 0;
    this._p = { x, y }; //top left
    this._d = direction;
    this._H = matrix.height;
    this._W = matrix.width;
  }

  _iterateOverOccupiedCells(operation) {
    let Y, X;
    const { x, y } = this._p;
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
    this._iterateOverOccupiedCells((cell) => (p += cell.state === 0 ? -1 : 1));
    let newState;
    let rgb;
    if (p > 0) {
      this._d = changeDirection(this._d, Rotation.CLOCKWISE);
      newState = 0;
      rgb = RGB.WHITE;
    } else {
      this._d = changeDirection(this._d, Rotation.COUNTERCLOCKWISE);
      newState = 1;
      rgb = RGB.BLACK;
    }
    let updated = [];
    this._iterateOverOccupiedCells((cell, x, y) => {
      cell.state = newState;
      updated.push({ x, y, ...rgb });
    });
    return updated;
  }

  dispose() {
    this._vacate();
  }

  move() {
    if (this._t !== 0) {
      return [];
    }

    this._vacate();
    this._p = this._getPos(this._p.x, this._p.y, this._d, BigAnt.SIZE);
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

BigAnt.SIZE = 3;
BigAnt.SLOW_FACTOR = 9;

function randomByte() {
  return Math.floor(Math.random() * 256);
}
