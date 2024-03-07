

let computeArray = [];
let value="";
let button = document.querySelector('.symbols');
let display = document.querySelector('.display');
let decimal = document.querySelector(".decimal");


button.addEventListener('click',(event) => {
    let target = event.target;

    switch(true){
        case target.classList.contains('clear'):
            display.value = "";
            value = "";
            computeArray=[];
            break;
        case target.classList.contains('op'):
            if (target.classList.contains('decimal')) target.disabled = true;

            record(target.textContent);

            //computeArray.push(target.textContent);
            if(target.textContent !== "="){
                display.value += target.textContent;
                break;
            }
            else{
                if (isNaN(computeArray[computeArray.length -1]) == false){
                    let result = evaluateInfixExpression(computeArray);
                    if (result != "CAN'T DIVIDE BY 0") display.value = formatNumber(result,4);
                    else display.value = "CAN'T DIVIDE BY 0";
                    computeArray=[];
                    computeArray.push(result);
                }

            }


    }
})


//this function stores the entered expression to be evaluated later
function record(operand){
    if(isNaN(operand) && operand != "."){
        if(value != "") computeArray.push(value);
        if (operand !== "=") computeArray.push(operand);
        value="";
        decimal.disabled = false;
    }
    else{
        value += operand;
    }
}



function evaluateInfixExpression(tokens) {
    const calculate = (operands, operators) => {
        const a = parseFloat(operands.pop());
        const b = parseFloat(operands.pop());
        const operator = operators.pop();

        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return b - a;
            case '*':
                return a * b;
            case '**':
                return Math.pow(b, a);
            case '/':
                if (a === 0) {
                    return "Nan";
                }
                return b / a;
            case '%':
                return b % a;
        }
    };

    const precedence = (c) => {
        switch (c) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
            case '%': // Modulus operator
                return 2;
            case '**':
                return 3;
        }
        return -1;
    };

    const isOperator = (c) => ['+', '-', '*', '/', '**', '%'].includes(c);

    const operands = [];
    const operators = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (!isNaN(parseFloat(token))) {
            operands.push(parseFloat(token));
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators[operators.length - 1] !== '(') {
                const ans = calculate(operands, operators);
                if (ans == "Nan") return "CAN'T DIVIDE BY 0";
                operands.push(ans);
            }
            operators.pop();
        } else if (isOperator(token)) {
            while (operators.length && precedence(token) <= precedence(operators[operators.length - 1])) {
                const ans = calculate(operands, operators);
                if (ans == "Nan") return "CAN'T DIVIDE BY 0";
                operands.push(ans);
            }
            operators.push(token);
        }
    }

    while (operators.length) {
        const ans = calculate(operands, operators);
        if (ans == "Nan") return "CAN'T DIVIDE BY 0";
        operands.push(ans);
    }

    return operands.pop();
}


//rounding the result to 4 decimal places and ignoring this for integer result
function formatNumber(num, decimalPlaces) {
    const integer = Math.floor(num);
    const fraction = num - integer;
  
    if (fraction === 0) {
      // If the number is an integer, return it as a string
      return integer.toString();
    } else {
      // Otherwise, format the number with the specified number of decimal places
      const multiplier = Math.pow(10, decimalPlaces);
      const formattedNumber = (integer + Math.round(fraction * multiplier) / multiplier).toFixed(decimalPlaces);
      return formattedNumber;
    }
  }