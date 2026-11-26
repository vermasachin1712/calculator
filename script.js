// ---- State: the calculator's memory ----
var current = "0";        // number being typed or shown
var previous = null;      // first number, saved when an operator is pressed
var operator = null;      // + - * /
var startNew = false;     // true = next digit replaces the screen

var screen = document.getElementById("screen");
var history = document.getElementById("history");
var symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// ---- Show the state on the page ----
function update() {
  screen.textContent = current;
  history.textContent = (previous !== null && operator) ? previous + " " + symbols[operator] : "";
}

// ---- Actions ----
function inputDigit(d) {
  if (current === "Error") clearAll();
  if (startNew || current === "0") {
    current = d;
    startNew = false;
  } else if (current.length < 12) {
    current += d;
  }
}

function inputDot() {
  if (current === "Error") clearAll();
  if (startNew) { current = "0"; startNew = false; }
  if (current.indexOf(".") === -1) current += ".";
}

function compute() {
  var a = parseFloat(previous);
  var b = parseFloat(current);
  var result;

  if (operator === "+") result = a + b;
  if (operator === "-") result = a - b;
  if (operator === "*") result = a * b;
  if (operator === "/") {
    if (b === 0) { current = "Error"; return; }
    result = a / b;
  }
  current = String(Math.round(result * 1e10) / 1e10); // fixes 0.1 + 0.2 style errors
}

function chooseOperator(op) {
  if (current === "Error") return;
  if (operator !== null && !startNew) {
    compute();
    if (current === "Error") { previous = null; operator = null; return; }
  }
  previous = current;
  operator = op;
  startNew = true;
}

function equals() {
  if (operator === null || previous === null) return;
  compute();
  previous = null;
  operator = null;
  startNew = true;
}

function clearAll() {
  current = "0"; previous = null; operator = null; startNew = false;
}

function backspace() {
  if (startNew || current === "Error") return;
  current = current.slice(0, -1);
  if (current === "" || current === "-") current = "0";
}

function percent() {
  if (current === "Error") return;
  current = String(parseFloat(current) / 100);
}

function negate() {
  if (current === "Error" || current === "0") return;
  current = current.charAt(0) === "-" ? current.slice(1) : "-" + current;
}

// ---- Decide what to do for each key ----
function handleKey(key) {
  if (key >= "0" && key <= "9" && key.length === 1) inputDigit(key);
  else if (key === ".") inputDot();
  else if (key === "+" || key === "-" || key === "*" || key === "/") chooseOperator(key);
  else if (key === "=") equals();
  else if (key === "C") clearAll();
  else if (key === "Backspace") backspace();
  else if (key === "%") percent();
  else if (key === "neg") negate();
  update();
}

// ---- Listen for mouse clicks on the buttons ----
document.getElementById("keys").addEventListener("click", function (e) {
  var button = e.target.closest("button");
  if (button) handleKey(button.dataset.key);
});

// ---- Listen for the computer keyboard ----
document.addEventListener("keydown", function (e) {
  var k = e.key;
  if (k === "Enter") { e.preventDefault(); k = "="; }
  if (k === "Escape") k = "C";
  if (k === ",") k = ".";
  var allowed = "0123456789.+-*/=%C";
  if (allowed.indexOf(k) !== -1 || k === "Backspace") {
    if (k === "/") e.preventDefault();
    handleKey(k);
  }
});

update();
