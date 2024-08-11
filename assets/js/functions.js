function factorial(n) {
  let ans = 1;

  if (n === 0) return 1;
  for (let i = 2; i <= n; i++) ans = ans * i;
  return ans;
}

function log(n, base = 10) {
  return Math.log(n) / Math.log(base);
}

function ln(n) {
  return Math.log(n);
}

function sin(n) {
  return Math.sin(n);
}

function cos(n) {
  return Math.cos(n);
}

function tan(n) {
  return Math.tan(n);
}

function sqrt(n) {
  return Math.sqrt(n);
}

function getIntPrompt(message) {
  try {
    let num = parseInt(prompt(message));
    return num;
  } catch (error) {
    return getIntPrompt(message);
  }
}

document.addEventListener("keydown", function (event) {
  const key = event.key;
  console.log(key);
  const keyMappings = {
    0: () => handleKeyPress("0"),
    1: () => handleKeyPress("1"),
    2: () => handleKeyPress("2"),
    3: () => handleKeyPress("3"),
    4: () => handleKeyPress("4"),
    5: () => handleKeyPress("5"),
    6: () => handleKeyPress("6"),
    7: () => handleKeyPress("7"),
    8: () => handleKeyPress("8"),
    9: () => handleKeyPress("9"),
    "+": () => handleKeyPress("+"),
    "-": () => handleKeyPress("-"),
    "*": () => handleKeyPress("*"),
    "x": () => handleKeyPress("*"),
    "X": () => handleKeyPress("*"),
    "/": () => handleKeyPress("/"),
    "=": () => handleKeyPress("="),
    "Enter": () => handleKeyPress("="),
    "%": () => handleKeyPress("%"),
    ".": () => handleKeyPress("."),
    "(": () => handleKeyPress("("),
    ")": () => handleKeyPress(")"),
    "!": () => handleKeyPress("fact"),
    "e": () => handleKeyPress("e"),
    "Backspace": () => handleKeyPress("Del"),
    "Delete": () => handleKeyPress("AC"),
  };

  if (keyMappings[key]) {
    keyMappings[key]();
  }
});

function handleKeyPress(key) {
  const button = document.querySelector(`button[data-key="${key}"]`);
  if (button) {
    button.click();
  }
}
