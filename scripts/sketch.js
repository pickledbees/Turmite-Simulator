const GRID_W = 300;
const GRID_H = 180;
const PIXEL_W = 4;
const TICK_RATE = 60;

//variables setup
let pen = new RadioVariable("Selected", { value: "Ant" });
let drawMode = new ToggleVariable("Draw Mode");
let tickRate = new SliderVariable("Tick Rate", {
  value: TICK_RATE,
  min: 0,
  max: 60,
});
let allowDeath = new ToggleVariable("Allow Death", { on: true });

const matrix = new CellMatrix(GRID_W, GRID_H);
let automatons = [];
let newAutomatons;

function setup() {
  createCanvas(GRID_W * PIXEL_W, GRID_H * PIXEL_W).parent("draw-space");
  noStroke();

  //ui set up
  const buttonBar = document.getElementById("button-bar");
  const display = document.getElementById("display");

  const fastForwardButton = document.createElement("button");
  fastForwardButton.innerText = "Fast Forward";
  fastForwardButton.onclick = () => {
    let i = 1000;
    while (i--) {
      iterate();
    }
  };

  buttonBar.appendChild(drawMode.button);
  buttonBar.appendChild(allowDeath.button);
  buttonBar.appendChild(pen.getNewButton("Ant", "Ant"));
  buttonBar.appendChild(pen.getNewButton("Termite", "Termite"));
  buttonBar.appendChild(pen.getNewButton("Beetle", "Beetle"));
  buttonBar.appendChild(pen.getNewButton("Spider", "Spider"));
  buttonBar.appendChild(pen.getNewButton("Big Ant", "Big Ant"));
  buttonBar.appendChild(pen.getNewButton("Block", "Block"));
  buttonBar.appendChild(pen.getNewButton("Erase", "Erase"));
  buttonBar.appendChild(fastForwardButton);

  display.appendChild(pen.display);
  display.appendChild(tickRate.display);
  display.appendChild(tickRate.slider);

  tickRate.subscribe(frameRate);
}

function spawn(x, y) {
  let a;
  switch (pen.value) {
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
      //enable snap
      const d = BigAnt.SIZE;
      const X = x - (x % d);
      const Y = y - (y % d);
      a = new BigAnt(X, Y, matrix, Direction.W);
      break;
    case "Block":
      drawOnMatrix(x, y, 1);
      break;
    case "Erase":
      drawOnMatrix(x, y, 0);
      break;
  }
  if (a) {
    automatons.push(a);
    renderAutomaton(a);
  }
}

function draw() {
  iterate();

  if (mouseIsPressed && drawMode.on) {
    passInGridCoordsFromMouse(spawn);
  }

  displayStats();
}

function iterate() {
  //spawn automatons
  automatons.forEach((a) => a.spawn());

  //run interactions and render interactions
  automatons.forEach((a) => {
    a.interact().forEach(({ x, y, r, g, b }) => colourCell(x, y, r, g, b));
  });

  //update new positions + remove dead automatons + obtain new automatons + render current automatons
  newAutomatons = [];
  automatons = automatons.filter((a) => {
    if (!allowDeath.on) {
      a.alive = true;
    }
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
}

function drawOnMatrix(x, y, state = 1) {
  matrix.getCell(x, y).state = state;
  const { r, g, b } = cellStateToRGB(state);
  colourCell(x, y, r, g, b);
}

function displayStats() {
  fill(0);
  rect(0, 0, 150, 22);
  fill(255);
  textSize(15);
  text(`Population: ${automatons.length}`, 5, 15);
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
