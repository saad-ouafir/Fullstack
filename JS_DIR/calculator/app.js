// Récupération des éléments du DOM
const displayEl = document.getElementById("display");
const keysEl = document.getElementById("keys");
const historyEl = document.getElementById("history");
const wrapperEl = document.getElementById("wrapper");

// État de la calculatrice
const state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: false,
  error: false,
  history: [],
};

// Affiche le nombre actuel sur l'écran
function renderDisplay() {
  displayEl.textContent = state.current;
}

// Ajoute une operation effectée à l'historique
function pushHistory(entryText) {
  state.history.unshift(entryText);
  state.history = state.history.slice(0, 5);
  historyEl.innerHTML = "";
  state.history.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    historyEl.appendChild(li);
  });
}

// Supprime les zéros inutiles après la virgule
function trimTrailingZeros(str) {
  if (!str.includes(".")) return str;
  return str.replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "");
}

// Formate le nombre pour l'affichage
function formatNumber(num) {
  if (!isFinite(num)) return "Error";
  const abs = Math.abs(num);
  let out;
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-6)) {
    out = num.toExponential(6);
  } else {
    out = trimTrailingZeros(Number(num.toFixed(10)).toString());
  }
  if (out.length > 12) {
    out = num.toExponential(6);
  }
  return out;
}

function toNumber(str) {
  return parseFloat(str);
}

// Fonctions de calcul sécurisées pour éviter les erreurs d'arrondi
// Addition
function safeAdd(a, b) {
  return toNumber(trimTrailingZeros(Number((a + b).toFixed(10)).toString()));
}

// Soustraction
function safeSub(a, b) {
  return toNumber(trimTrailingZeros(Number((a - b).toFixed(10)).toString()));
}

// Multiplication
function safeMul(a, b) {
  return toNumber(trimTrailingZeros(Number((a * b).toFixed(10)).toString()));
}

// Division
function safeDiv(a, b) {
  if (b === 0) return Infinity;
  return toNumber(trimTrailingZeros(Number((a / b).toFixed(10)).toString()));
}

// Gestion de la saisie des chiffres
function inputDigit(digit) {
  if (state.error) return;
  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
    renderDisplay();
    return;
  }
  if (state.current === "0") {
    state.current = digit;
  } else {
    state.current += digit;
  }
  renderDisplay();
}

function inputDecimal() {
  if (state.error) return;
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
    renderDisplay();
    return;
  }
  if (!state.current.includes(".")) {
    state.current += ".";
    renderDisplay();
  }
}

function chooseOperator(op) {
  if (state.error) return;
  if (state.operator && state.previous !== null) {
    evaluate();
  }
  state.previous = state.current;
  state.operator = op;
  state.overwrite = true;
}

function compute(aStr, op, bStr) {
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);
  switch (op) {
    case "+":
      return safeAdd(a, b);
    case "-":
      return safeSub(a, b);
    case "*":
      return safeMul(a, b);
    case "/":
      return safeDiv(a, b);
    default:
      return b;
  }
}

function evaluate() {
  if (state.error) return;
  if (state.previous === null || !state.operator) return;
  const result = compute(state.previous, state.operator, state.current);
  const formatted = formatNumber(result);
  if (formatted === "Error") {
    state.error = true;
    state.current = "Error";
  } else {
    const histText = `${state.previous} ${state.operator} ${state.current} = ${formatted}`;
    pushHistory(histText);
    state.current = formatted;
  }
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  renderDisplay();
}

function handleCommand(cmd) {
  switch (cmd) {
    case "AC":
      state.current = "0";
      state.previous = null;
      state.operator = null;
      state.overwrite = false;
      state.error = false;
      renderDisplay();
      break;
    case "CE":
      if (state.error) {
        state.current = "0";
        state.error = false;
      } else {
        state.current = "0";
      }
      state.overwrite = false;
      renderDisplay();
      break;
    case "neg":
      if (state.error) return;
      if (state.current === "0") return;
      state.current = state.current.startsWith("-")
        ? state.current.slice(1)
        : "-" + state.current;
      renderDisplay();
      break;
    case "pct":
      if (state.error) return;
      const num = parseFloat(state.current);
      const pct = formatNumber(num / 100);
      if (pct === "Error") {
        state.error = true;
        state.current = "Error";
      } else {
        state.current = pct;
      }
      renderDisplay();
      break;
  }
}

// Gestion des clics sur les boutons de la calculatrice
function handleClick(button) {
  const type = button.getAttribute("data-type");
  const value = button.getAttribute("data-value");
  if (type === "digit") {
    if (value === ".") {
      inputDecimal();
    } else {
      inputDigit(value);
    }
    return;
  }
  if (type === "op") {
    chooseOperator(value);
    return;
  }
  if (type === "eq") {
    evaluate();
    return;
  }
  if (type === "cmd") {
    handleCommand(value);
    return;
  }
}

wrapperEl.addEventListener(
  "click",
  () => {
    console.log("capture wrapper");
  },
  { capture: true }
);

wrapperEl.addEventListener("click", () => {
  console.log("bubble wrapper");
});

keysEl.addEventListener("click", (event) => {
  console.log("keys clicked");
  const button = event.target.closest("button");
  if (!button || !keysEl.contains(button)) return;
  if (button.getAttribute("data-type") === "op") {
    event.stopPropagation();
  }
  handleClick(button);
});

// Gestion des touches du clavier
function handleKeydown(e) {
  if (e.key >= "0" && e.key <= "9") {
    inputDigit(e.key);
    return;
  }
  if (e.key === ".") {
    inputDecimal();
    return;
  }
  if (["+", "-", "*", "/"].includes(e.key)) {
    chooseOperator(e.key);
    return;
  }
  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    evaluate();
    return;
  }
  if (e.key === "Backspace") {
    e.preventDefault();
    handleCommand("CE");
    return;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    handleCommand("AC");
    return;
  }
}

document.addEventListener("keydown", handleKeydown);

renderDisplay();
