const DEFAULT_RULE = {
  c: 0,
  s: 0,
  r: 0,
};

//TODO: improve error handling
class RuleSet {
  constructor(cl, sl) {
    const rs = [];
    let r;
    for (let i = 0; i < cl; i++) {
      r = [];
      for (let j = 0; j < sl; j++) {
        r.push(DEFAULT_RULE);
      }
      rs.push(r);
    }
    this._rs = rs;
  }

  get cellStateCount() {
    return this._rs.length;
  }

  get miteStateCount() {
    return this._rs[0].length;
  }

  setRule(cellState, miteState, rule) {
    try {
      this._rs[cellState][miteState] = rule;
      return true;
    } catch (e) {
      return false;
    }
  }

  addCellState(index) {
    const r = [];
    for (let i = 0; i < this.miteStateCount; i++) r.push(DEFAULT_RULE);
    this._rs.splice(index, 0, r);
  }

  removeCellState(index) {
    this._rs.splice(index, 1);
  }

  addMiteState(index) {
    for (let cs of this._rs) {
      cs.splice(index, 0, DEFAULT_RULE);
    }
  }

  removeMiteState(index) {
    for (let cs of this._rs) {
      cs.splice(index, 1);
    }
  }

  get() {
    return {
      invalidCells: this._getInvalid(),
      ruleSet: this._rs,
    };
  }

  //returns invalid cells
  _getInvalid() {
    const ubcl = this.cellStateCount - 1;
    const ubsl = this.miteStateCount - 1;
    const invalid = [];
    this._rs.forEach((cs, ci) => {
      cs.forEach(({ c, s, r }, si) => {
        if (c > ubcl || s > ubsl) {
          invalid.push([ci, si]);
        }
      });
    });
    return invalid;
  }

  //debugging
  print() {
    const table = {};
    this._rs.forEach((cs, i) => {
      table["c" + i] = cs.map((r) => `c:${r.c} s:${r.s} r:${r.r}`);
    });
    console.table(table);
    this.printIsValid();
  }

  printIsValid() {
    const invalid = this._getInvalid();
    console.log("invalid:", invalid.length !== 0, invalid);
  }
}

const rs = new RuleSet(2, 1);
rs.setRule(0, 0, { c: 1, s: 1, r: 1 });
rs.print();
rs.addMiteState(1);
rs.print();
rs.setRule(0, 1, { c: 2, s: 1, r: 1 });
rs.print();
rs.setRule(0, 0, { c: 1, s: 1, r: 1 });
rs.removeMiteState(1);
rs.print();
