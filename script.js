let buttons = document.querySelectorAll(".button");
let screen = document.querySelector(".screenA");

for (i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener("click", function(e) {
        if (button.id != "equals")
            screen.innerText += button.innerText;

        if (button.id == "equals") screen.innerText = calc(screen.innerText);
        if (button.id == "ce") screen.innerText = calc("");

        if (button.classList.contains("operator")) {

        }

    });
}






plus = (x, y) => parseFloat(x) + parseFloat(y);
subtract = (x, y) => parseFloat(x) - parseFloat(y);
multiply = (x, y) => parseFloat(x) * parseFloat(y);
divide = (x, y) => parseFloat(x) / parseFloat(y);
pow = (x, y) => Math.pow(parseFloat(x), parseFloat(y));
let operators = ["+", "-", "/", "*", "^"];

function operate(operator, operand1, operand2) {
    if (operator == "+") return plus(operand1, operand2);
    else if (operator == "-") return subtract(operand1, operand2);
    else if (operator == "*") return multiply(operand1, operand2);
    else if (operator == "/") return divide(operand1, operand2);
    else if (operator == "^") return pow(operand1, operand2);
}

function getLeftOperand(str, i) {
    let prevChar = i - 1;
    let temp = "";
    while (isNumber(str[prevChar] + temp)) {
        temp = str[prevChar].toString() + temp;
        --prevChar;
    }
    return temp;
}


function getRightOperand(str, operatorIndex) {
    let nextChar = operatorIndex + 1;
    let temp = "";
    while (isNumber(temp + str[nextChar]) ||
        //checks "AH, baka naman yung pinakauna palang chinecheck mo? Pwedeng - yan
        (nextChar - operatorIndex == 1 && str[nextChar] == "-" && isNumber(str[nextChar + 1]) ||
            str[nextChar] == ".")) {
        temp += str[nextChar].toString();
        ++nextChar;
    }
    return temp;
}


function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }


function calc(str) {

    let openParCtr = (str.match(/\(/g) || []).length;
    let powCtr = (str.match(/\^/g) || []).length;
    let multCtr = (str.match(/\*/g) || []).length;
    let divCtr = (str.match(/\//g) || []).length;
    let plusCtr = (str.match(/\+/g) || []).length;
    let minusCtr = (str.match(/\-/g) || []).length;

    let opersLvl1 = minusCtr + plusCtr;
    let opersLvl2 = divCtr + multCtr;

    while (openParCtr > 0) {
        str = evalOnePar(str, openParCtr);
        --openParCtr;
    }
    while (powCtr > 0) {
        str = evalOneExpression(str, "^", powCtr);
        --powCtr;
    }
    while (opersLvl2 > 0) {
        str = evalOneExpression(str, ["*", "/"], opersLvl2);
        --opersLvl2;
    }

    while (opersLvl1 > 0) {
        str = evalOneExpression(str, ["+", "-"], opersLvl1);
        --opersLvl1;
    }
    /*
        while (multCtr > 0) {
            str = evalOneExpression(str, "*", multCtr);
            --multCtr;
        }
        while (divCtr > 0) {
            str = evalOneExpression(str, "/", divCtr);
            --divCtr;
        }
    
    while (plusCtr > 0) {
        str = evalOneExpression(str, "+", plusCtr);
        --plusCtr;
    }
    while (minusCtr > 0) {
        str = evalOneExpression(str, "-", minusCtr);
        --minusCtr;
    }
*/
    return str;
}




function evalOneExpression(str, operators) {
    let leftOthers = "";
    let rightOthers = "";
    let leftOperand = "";
    let rightOperand = "";
    let whichOperator = "";

    for (i = 0; i < str.length; i++) {
        if (operators.includes(str[i])) {
            whichOperator = str[i];
            //maybe i funct ko to.. isLoneNegative
            if (i == 0) return str;

            leftOperand = getLeftOperand(str, i);
            rightOperand = getRightOperand(str, i);
            leftOthers = str.slice(0, i - leftOperand.length);
            rightOthers = str.slice(i + rightOperand.length + 1, str.length);


            str = leftOthers +
                operate(whichOperator, leftOperand, rightOperand) +
                rightOthers;

            i = 0;
        }
    }

    return str;
}

function evalOnePar(str) {
    let currentParLvl = 0;
    let deepestParLvl = 0;
    let deepestOpenParIndex = 0;
    let deepestCloseParIndex = 0;
    let isDeepestClosed = false; //ex: (10+5) - (3+4); if same level lang yung (), it won't reassign deepestCloseParIndex porket nakakita lang ng another ).



    //get deepest
    for (i = 0; i < str.length; i++) {
        if (str[i] == "(") {
            currentParLvl++;
            if (currentParLvl > deepestParLvl) {
                deepestParLvl = currentParLvl;
                deepestOpenParIndex = i;
                isDeepestClosed = false;
            }
        } else if (str[i] == ")") {
            if (currentParLvl == deepestParLvl && isDeepestClosed == false) {
                deepestCloseParIndex = i;
                isDeepestClosed = true;
                currentParLvl--;
            }
        }
    }

    return (str.slice(0, deepestOpenParIndex) +
        calc(str.slice(deepestOpenParIndex + 1, deepestCloseParIndex)) +
        str.slice(deepestCloseParIndex + 1)
    );

}

let x = "(10*9.5)/0.5+17.5*(55-99)";
console.log(x);
console.log(calc(x));