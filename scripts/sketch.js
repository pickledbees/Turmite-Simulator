import { CellState, CellMatrix } from "./scripts/util/matrix";
import { Ant } from "./scripts/automaton";

const GRID_W = 500;
const GRID_H = 500;
const PIXEL_W = 2;

const matrix = new CellMatrix(GRID_W, GRID_H);
let automatons = [new Ant(GRID_W / 2, GRID_H / 2, matrix)];
let newAutomatons;

function setup() {
  createCanvas(GRID_W * PIXEL_W, GRID_H * PIXEL_W).parent("draw-space");
  noStroke();
}

function draw() {
  //run interactions and render interactions
  automatons.forEach((a) =>
    a.interact().forEach(({ x, y }) => renderCell(x, y))
  );

  //update new positions + remove dead automatons + obtain new automatons + render automatons
  newAutomatons = [];
  automatons = automatons.filter((a) => {
    if (a.alive) {
      newAutomatons = newAutomatons.concat(a.move());
      renderAutomaton(a);
      return true;
    } else {
      return false;
    }
  });

  //render new automatons
  newAutomatons.forEach(renderAutomaton);

  automatons = automatons.concat(newAutomatons);
}

function renderAutomaton(a) {
  const { x, y, r, g, b } = a.getColourPoints();
  colourCell(x, y, r, g, b);
}

function renderCell(x, y) {
  switch (matrix.getCell(x, y).state) {
    case CellState.WHITE:
      colourCell(x, y, 255, 255, 255);
      break;
    case CellState.BLACK:
      colourCell(x, y, 0, 0, 0);
      break;
  }
}

function colourCell(x, y, r, g, b) {
  fill(r, g, b);
  rect(x * GRID_W * PIXEL_W, y * GRID_H * PIXEL_W, PIXEL_W, PIXEL_W);
}
