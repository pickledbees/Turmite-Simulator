const GRID_W = 300;
const GRID_H = 150;
const PIXEL_W = 4;
const TICK_RATE = 60;

//variables setup
let automaton = new RadioVariable("Mode", { value: "Ant" });
let drawMode = new ToggleVariable("Draw Mode");
let tickRate = new SliderVariable("Tick Rate", {
  value: TICK_RATE,
  min: 0,
  max: 60,
});

const matrix = new CellMatrix(GRID_W, GRID_H);
let automatons = [];
let newAutomatons;

function setup() {
  createCanvas(GRID_W * PIXEL_W, GRID_H * PIXEL_W).parent("draw-space");
  noStroke();

  //ui set up
  const buttonBar = document.getElementById("button-bar");
  const display = document.getElementById("display");

  buttonBar.appendChild(drawMode.button);
  buttonBar.appendChild(automaton.getNewButton("Ant", "Ant"));
  buttonBar.appendChild(automaton.getNewButton("Termite", "Termite"));
  buttonBar.appendChild(automaton.getNewButton("Beetle", "Beetle"));
  buttonBar.appendChild(automaton.getNewButton("Spider", "Spider"));
  buttonBar.appendChild(automaton.getNewButton("Big Ant", "Big Ant"));

  display.appendChild(automaton.display);
  display.appendChild(tickRate.display);
  display.appendChild(tickRate.slider);

  tickRate.subscribe(frameRate);
}

function spawn(x, y) {
  let a;
  switch (automaton.value) {
    case "Ant":
      a = new Turmite(x, y, matrix, ANT, RGB.RED, Direction.W);
      break;
    case "Termite":
      a = new Turmite(x, y, matrix, TERMITE, RGB.CYAN, Direction.W);
      break;
    case "Beetle":
      a = new Turmite(x, y, matrix, BEETLE, RGB.GREEN, Direction.W);
      break;
    case "Spider":
      a = new Turmite(x, y, matrix, SPIDER, RGB.MAGENTA, Direction.W);
      break;
    case "Big Ant":
      a = new BigAnt(x, y, matrix, Direction.W);
      break;
  }
  automatons.push(a);
}

function draw() {
  //spawn automatons
  automatons.forEach((a) => a.spawn());

  //run interactions and render interactions
  automatons.forEach((a) => {
    a.interact().forEach(({ x, y, r, g, b }) => colourCell(x, y, r, g, b));
  });

  //update new positions + remove dead automatons + obtain new automatons + render current automatons
  newAutomatons = [];
  automatons = automatons.filter((a) => {
    if (a.alive) {
      newAutomatons = newAutomatons.concat(a.move());
      renderAutomaton(a);
      return true;
    } else {
      a.dispose();
      return false;
    }
  });

  //render new automatons
  newAutomatons.forEach(renderAutomaton);

  //update automatons
  automatons = automatons.concat(newAutomatons);

  if (mouseIsPressed && drawMode.on) {
    passInGridCoordsFromMouse(spawn);
  }
}

function mouseClicked() {
  if (!drawMode.on) {
    passInGridCoordsFromMouse(spawn);
  }
}

function passInGridCoordsFromMouse(callback) {
  if (
    mouseX > 0 &&
    mouseY > 0 &&
    mouseX < GRID_W * PIXEL_W &&
    mouseY < GRID_H * PIXEL_W
  ) {
    const X = Math.floor(mouseX / PIXEL_W);
    const Y = Math.floor(mouseY / PIXEL_W);
    callback(X, Y);
  }
}

function renderAutomaton(a) {
  a.getColourPoints().forEach(({ x, y, r, g, b }) => colourCell(x, y, r, g, b));
}

function colourCell(x, y, r, g, b) {
  fill(r, g, b);
  rect(x * PIXEL_W, y * PIXEL_W, PIXEL_W, PIXEL_W);
}
