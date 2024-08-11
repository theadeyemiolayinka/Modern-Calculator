/**
 * Constant Declarations
 *
 */

const HISTORY_KEY = "history";

const frame = document.getElementById("frame");
const screenDisplay = document.getElementById("display_screen");
const resultDisplay = document.getElementById("display_result");
const polarUnit = document.getElementById("polar_unit");
const historyPanel = $("#historyPanel");
const closeHistoryBtn = document.getElementById("closeHistory");
const clearHistoryBtn = document.getElementById("clearHistory");
const historyItemsContainer = document.getElementById("historyItems");

const keys = document.querySelectorAll(".key__item");

var operator_lock = false;
var equal_lock = false;
var polar_unit = "deg";
var historyStore = [];

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
    ? polar_unit.value == null
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

function addNumber(value, prepend = true) {
  if (screenDisplay.value === "0") {
    operator_lock = false;
    screenDisplay.setAttribute("value", "");
    updateScreen(value);
    calculateResult();
  } else {
    operator_lock = false;
    updateScreen(value, prepend);
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

function togglePolarUnit() {
  if (polar_unit === "deg") {
    polar_unit = "rad";
  } else {
    polar_unit = "deg";
  }
  polarUnit.textContent = polar_unit;
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
      if (resultDisplay.value === "Error") {
        return;
      }
      let question = new Question(screenDisplay.value, resultDisplay.value);
      addHistory(question);
      updateScreen(resultDisplay.value, false);
      equal_lock = true;
      clearResult();
    } else {
      try {
        calculateResult();
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

          case "sin":
            num = parseInt(resultDisplay.value);
            if (polar_unit === "deg") {
              num = num * (Math.PI / 180);
            }
            updateScreen(Math.sin(num), false);
            calculateResult();
            break;

          case "cos":
            num = parseInt(resultDisplay.value);
            if (polar_unit === "deg") {
              num = num * (Math.PI / 180);
            }
            updateScreen(Math.cos(num), false);
            calculateResult();
            break;

          case "tan":
            num = parseInt(resultDisplay.value);
            if (polar_unit === "deg") {
              num = num * (Math.PI / 180);
            }
            updateScreen(Math.tan(num), false);
            calculateResult();
            break;

          case "pol":
            togglePolarUnit();
            break;

          case "history":
            toggleHistoryPanel();
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
              addNumber(value, !equal_lock);
            }
            if (equal_lock) {
              equal_lock = false;
            }
            break;
        }
      } catch (error) {
        updateResult("Error");
      }
    }
  });
});

/**
 * History Panel
 *
 */

function addHistory(value) {
  var history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  history.unshift(value);
  history = history.slice(0, 10);
  console.log(history);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history, null, 2));
  renderHistory();
}

function removeHistory(index) {
  var history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  history.splice(index, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history, null, 2));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function setState(index) {
  try {
    question = historyStore[index];
    screenDisplay.setAttribute("value", question.question);
    resultDisplay.setAttribute("value", question.answer);
  } catch (error) {
    // Do nothing
    alert("Invalid question");
  }
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  // questions = history.map((item, index) => Question.fromJson(item, index));
  questions = history.map(
    (item, index) => new Question(item.question, item.answer, index)
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(questions, null, 2));
  historyStore = questions;
  if (questions.length === 0) {
    historyItemsContainer.innerHTML =
      "<div class='history-item-ctn'><center style='width: 100%; text-align: center;'>No history</center></div>";
    return;
  }
  historyItemsContainer.innerHTML = questions
    .map(
      (question) =>
        `<div class="history-item-ctn">
          <div class="history-item" onclick="setState(${question.index})">
            <span class="history-item__question">${question.question}</span>
            <span class="history-item__answer">${question.answer}</span>
          </div>
          <div class="history-item__remove" onclick="removeHistory(${question.index})">
            <i class="fas fa-trash"></i>
          </div>
        </div>`
    )
    .join("");
}

function toggleHistoryPanel() {
  historyPanel.toggle("slide", { direction: "left" }, 300);
  if (historyPanel.is(":visible")) {
    historyPanel.addClass("history-panel--open");
  } else {
    historyPanel.removeClass("history-panel--open");
  }
  renderHistory();
}

// Event Listeners
closeHistoryBtn.addEventListener("click", toggleHistoryPanel);
clearHistoryBtn.addEventListener("click", clearHistory);
