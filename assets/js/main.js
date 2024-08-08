/**
 * Constant Declarations
 *
 */

const HISTORY_KEY = "history";

const frame = document.getElementById("frame");
const screenDisplay = document.getElementById("display_screen");
const resultDisplay = document.getElementById("display_result");

const keys = document.querySelectorAll(".key__item");

var operator_lock = false;

/**
 * Functions
 */

function updateScreen(value, prepend = true) {
  prepend
    ? screenDisplay.value == null
      ? screenDisplay.setAttribute("value", value)
      : screenDisplay.setAttribute("value", screenDisplay.value + value)
    : screenDisplay.setAttribute("value", value);
}

function updateResult(value, prepend = true) {
  prepend
    ? resultDisplay.value == null
      ? resultDisplay.setAttribute("value", value)
      : resultDisplay.setAttribute("value", resultDisplay.value + value)
    : resultDisplay.setAttribute("value", value);
}

function clearScreen() {
  screenDisplay.setAttribute("value", "0");
}

function clearResult() {
  resultDisplay.setAttribute("value", "");
}

function calculateResult() {
  try {
    let prompt = screenDisplay.value;
    if (prompt === "") {
      return;
    }
    if (/[\+\-\*\/]$/g.test(prompt)) {
      // Checks if the last character is an operator
      prompt = prompt.slice(0, -1);
    }
    // Sanitizing the prompt to prevent XSS attacks
    let sanitizedPrompt = prompt.replace(/(<([^>]+)>)/gi, "");
    let result = eval(sanitizedPrompt) ? eval(sanitizedPrompt) : 0;
    if (result === Infinity) {
      result = "Error";
    }

    resultDisplay.setAttribute("value", result);

    if (screenDisplay.value === "0") {
      resultDisplay.setAttribute("value", "");
    }
  } catch (error) {
    resultDisplay.setAttribute("value", "Error");
  }
}

function addHistory(value) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  history.push(value);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function addNumber(value) {
  if (screenDisplay.value === "0") {
    operator_lock = false;
    screenDisplay.setAttribute("value", "");
    updateScreen(value);
    calculateResult();
  } else {
    operator_lock = false;
    updateScreen(value);
    calculateResult();
  }
}

function addOperator(value) {
  if (screenDisplay.value !== "0") {
    if (operator_lock) {
      return;
    }
    updateScreen(value);
    operator_lock = true;
  }
}

function clearCharacter() {
  screenDisplay.setAttribute("value", screenDisplay.value.slice(0, -1));
  if (screenDisplay.value === "") {
    screenDisplay.setAttribute("value", "0");
  }
  calculateResult();
}

function toggleFunctionsPanel() {
  frame.classList.toggle("frame--functions");
}

keys.forEach((key) => {
  key.addEventListener("click", (e) => {
    target = e.target;
    if (target.tagName.toLowerCase() === "i") {
      target = target.closest("button");
    }
    const value = target.getAttribute("data-key").toString();
    if (value === "AC") {
      clearScreen();
      clearResult();
    } else if (value === "Del") {
      clearCharacter();
    } else if (value === "Func") {
      toggleFunctionsPanel();
    } else if (value === "=") {
      if (screenDisplay.value === "") {
        return;
      }
      if (resultDisplay.value === "") {
        return;
      }
      let question = new Question(screenDisplay.value, resultDisplay.value);
      addHistory(question.toJson());
      updateScreen(resultDisplay.value, false);
      clearResult();
    } else {
      try {
        switch (value) {
          case "PI":
            updateScreen(Math.PI, /[\+\-\*\/]$/g.test(screenDisplay.value));
            calculateResult();
            break;

          case "Inv":
            updateScreen(1 / resultDisplay.value, false);
            calculateResult();
            break;

          case "fact":
            updateScreen(factorial(resultDisplay.value), false);
            calculateResult();
            break;

          case "root":
            updateScreen(Math.sqrt(resultDisplay.value), false);
            calculateResult();
            break;

          case "ln":
            updateScreen(Math.log(resultDisplay.value), false);
            calculateResult();
            break;

          case "log":
            updateScreen(Math.log10(resultDisplay.value), false);
            calculateResult();
            break;

          case "pow":
            let power = getIntPrompt("Enter the power");
            updateScreen(Math.pow(resultDisplay.value, power), false);
            calculateResult();
            break;

          default:
            if (target.classList.contains("key--operator")) {
              addOperator(value);
            } else {
              addNumber(value);
            }
            break;
        }
      } catch (error) {
        updateResult("Error");
      }
    }
  });
});
