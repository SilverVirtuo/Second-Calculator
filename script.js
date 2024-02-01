//Bugs
//possible bug: wrong answers with long calculations!! (done?)
//bug: when divided by 0 it works only with 0.0 (done?)
//adding "." after on the calculated result(after inputting "=") doesnt work

//To do:
//add scrolling to display to be able to see the whole calculation (done)
//add "C" button
//add input with keyboard
//parentheses
/////////////////////////////////////////////////////////////////
"use strict";

//declare html elements
//buttons
const buttonElement = document.querySelectorAll("#btn");
//display
const displayElement = document.querySelector("#display");

//declare inputArray[]
// let inputArray = ["3", "5", "-", "2", "5", "/", "0", ".", "0", "1", "*", "2"];
// let inputArray = ["3", "5", "-", "2", "5"];
let inputArray = [];
let buttonInput, inputArrayLength;

// let inputArray = [
//         "5",
//         "2",
//         "*",
//         "6",
//         ".",
//         "3",
//         "-",
//         "9",
//         ".",
//         "1",
//         "*",
//         "4",
//         "/",
//         "8",
//         "+",
//         "2",
//         "0",
// ];

//check for decimal number with 0
let decimalCheck = false;

//Initialization
function init() {
        inputArray = [];
        displayElement.textContent = "";
        decimalCheck = false;
}

//helper function isOperation that returns true(operation) if input is an operation and false if its not
function isOperation(arg) {
        if (arg === "+" || arg === "-" || arg === "*" || arg === "/")
                return arg;
        else return false;
}

//helper function isSign that returns true(sign) if input is a sign and false if its not
function isSign(arg) {
        if (
                arg === "+" ||
                arg === "-" ||
                arg === "*" ||
                arg === "/" ||
                arg === "."
        )
                return arg;
        else return false;
}

//Look for the index of the first operation and return its index
function indexOfOperation(array, operation1, operation2) {
        let indexOfOp1 = array.indexOf(operation1);
        let indexOfOp2 = array.indexOf(operation2);

        if (indexOfOp1 != -1 && indexOfOp2 != -1)
                if (indexOfOp1 < indexOfOp2) return [indexOfOp1, operation1];
                else return [indexOfOp2, operation2];
        else if (indexOfOp1 != -1) return [indexOfOp1, operation1];
        else if (indexOfOp2 != -1) return [indexOfOp2, operation2];
        else return [-1, ""];
}

//calculate, get 2 numbers and a operation as an input and return result
function calculate(num1, num2, operation) {
        //since all numbers are string i am too lazy to convert them properly and ill do it here :D
        //POSSIBLE BUGS IF I DONT CONVERT IT BACK TO STRING WHEN RETURNING!!
        num1 = +num1;
        num2 = +num2;
        switch (operation) {
                case "*":
                        return num1 * num2;
                case "/":
                        return num1 / num2;
                case "+":
                        return num1 + num2;
                case "-":
                        return num1 - num2;
        }
}

//calculation according to operation priority, takes array and operations as strings as arguments
function priorityCalculate(array, operation1, operation2) {
        //              look for the first * or / (or asigned operations), find its position in the array and calculate using numbers on previous and next position
        //
        let opIndex = indexOfOperation(array, operation1, operation2);
        // Calculate loop
        //                      slice array items after "next" item and store it into a new array
        while (opIndex[0] != -1) {
                let nextArray = array.slice(opIndex[0] + 2);
                //                      slice array before "previous" item, add to it result of the calculation and add back slice after "next" item and make this array a new inputArray
                let previousArray = array.slice(0, opIndex[0] - 1);

                //calculate
                let res = calculate(
                        array[opIndex[0] - 1],
                        array[opIndex[0] + 1],
                        opIndex[1]
                );
                //push res to "previous" array and concat with "next" array
                previousArray.push(res);
                // previousArray.concat(nextArray).forEach((val, i) => {
                //         array[i] = val;
                // });
                array = previousArray.concat(nextArray);
                opIndex = indexOfOperation(array, operation1, operation2);
        }
        if (!array) return;
        else return array;
}

//get input (numbers and operations)
buttonElement.forEach((button) =>
        button.addEventListener("click", function (e) {
                //declare .textContet to attempt in improving performance
                buttonInput = button.textContent;

                //set calcCheck false on every input so only when "=" is inputted will it calculate
                let calcCheck = false;
                //reset button
                if (buttonInput === "CE") {
                        init();
                        return;
                }

                //RULES
                //      if first input = (=, +, -, *, / || last element in array is operation and one more operation is inputted) return

                if (
                        //inputArray[0] must exist
                        // inputArray[0] &&
                        //inputArray[0] type must be number
                        typeof inputArray[0] === "number" &&
                        //input must be operation, not "."!
                        !isOperation(buttonInput) &&
                        //inputArray[1] must not exist
                        !inputArray[1]
                )
                        return;
                else if (
                        //inputArray[0] doesnt exist
                        !inputArray[0] &&
                        //input must not be sign (operation + ".") otherwise return
                        isSign(buttonInput)
                )
                        return;

                if (
                        //if previous input is sign, and new input is sign return
                        inputArray[inputArray.length - 1] ===
                                isSign(inputArray[inputArray.length - 1]) &&
                        isSign(buttonInput)
                )
                        return;

                //if input is 0
                //if 0 is inputted as a first number or if its inputted after an operation
                if (
                        buttonInput === "0" &&
                        inputArray[inputArray.length - 1] === "0" &&
                        (!inputArray[inputArray.length - 2] ||
                                isOperation(inputArray[inputArray.length - 2]))
                ) {
                        return;
                } else if (decimalCheck && buttonInput === ".") return;
                else if (isOperation(buttonInput)) decimalCheck = false;
                else if (buttonInput === ".") decimalCheck = true;

                //      print input as its inputted
                //              display =+ inputArray[i] = input - input has to be string
                if (buttonInput != "=") {
                        //push input into an inputArray and display it
                        inputArray.push(buttonInput);
                        displayElement.textContent += buttonInput;

                        //scroll dispay to show the last input
                        displayElement.scrollLeft = displayElement.scrollWidth;
                }

                //if "=" is unputted first run a check if there is any calculation to do, if not calcFalse and code doesnt run, else calcTrue and code runs
                if (buttonInput === "=") {
                        inputArray.forEach((item) => {
                                if (isOperation(item)) calcCheck = true;
                        });
                }

                //      if calcCheck is true, first item exists and last item in inputArray is not a sign calculate
                if (
                        calcCheck &&
                        inputArray[inputArray.length - 1] !==
                                isSign(inputArray[inputArray.length - 1])
                ) {
                        //              extract numbers and operations from the array
                        //                      const calcArray = inputArray concat numbers until you get to operation,     operation is alone and continue with concating numbers
                        const calcArray = [];
                        let j = 0;
                        for (let i = 0; i < inputArray.length; i++) {
                                //if operation is found, go up the array, add operation to be by itself, go up the array again to keep adding numbers
                                if (isOperation(inputArray[i])) {
                                        j++;
                                        calcArray[j] = inputArray[i];
                                        j++;
                                } else {
                                        //empty array is undefined so it need to equal something before adding numbers to the string, otherwise result would be "undefined8432"
                                        if (!calcArray[j])
                                                calcArray[j] = inputArray[i];
                                        else calcArray[j] += inputArray[i];
                                }
                        }

                        let workArray = calcArray.slice(0);

                        //multiplication and division
                        workArray = priorityCalculate(workArray, "*", "/");
                        //addition and subtraction
                        workArray = priorityCalculate(workArray, "+", "-");
                        //              clear displayed and display
                        //              display result and store it in input array[0]
                        inputArray = [];

                        displayElement.textContent = inputArray[0] =
                                Math.round(
                                        (workArray[0] + Number.EPSILON) *
                                                10000000
                                ) / 10000000;
                        // workArray[0];
                }
        })
);
