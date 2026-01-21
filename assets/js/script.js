var left = '';
var operator = '';
var right = '';
let wordPlaceholder = document.getElementById('word-result');
function appendToResult(value) {
    if (operator.length == 0) {
        left += value;
    } else {
        right += value;
    }
    updateResult();
}

function bracketToResult(value) {
    document.getElementById('result').value += value;
}
function operatorToResult(value) {
    if (right.length) {
        calculateResult();
    }
    operator = value;
    updateResult();
}
function clearResult() {
    left = '';
    right = '';
    operator = '';

    document.getElementById('word-result').innerHTML = '';
    updateResult();
    enableSpeakButton();
}

function updateResult() {
    const resultElement = document.getElementById('result')
    if (operator.length === 0) {
        resultElement.value = left;
    } else {
        resultElement.value = `${left} ${operator} ${right}`;
    }
}

function numberToWords(numVal) {
    if (numVal === 0) return 'zero';

    const numStr = numVal.toString();
    const [integerPart, decimalPart] = numStr.split('.');

    const integerWords = convertIntegerToWords(integerPart);
    const decimalWords = decimalPart ? convertDecimalToWords(decimalPart) : '';

    return decimalPart
        ? `${integerWords} point ${decimalWords}`
        : integerWords;
}



function convertIntegerToWords(numStr) {
    const singleDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['','thousand', 'million', 'billion', 'trillion'];

    let words = '';
    let num = parseInt(numStr, 10);

    if (num === 0) {
        return 'zero';
    }

    if (num < 0) {
        words += 'negative ';
        num = Math.abs(num);
    }

    let place = 0;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk) {
            const chunkWords = convertChunkToWords(chunk);
            words = `${chunkWords} ${thousands[place]} ${words}`.trim();
        }
        num = Math.floor(num / 1000);
        place++;
    }

    return words.trim();
}

function convertChunkToWords(chunk) {
    const singleDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    let words = '';

    if (chunk >= 100) {
        const hundreds = Math.floor(chunk / 100);
        words += `${singleDigits[hundreds]} hundred `;
        chunk %= 100;
    }

    if (chunk >= 20) {
        const tensPlace = Math.floor(chunk / 10);
        words += `${tens[tensPlace - 1]} `;
        chunk %= 10;
    } else if (chunk >= 11) {
        words += `${teens[chunk - 11]} `;
        chunk = 0;
    } else if (chunk === 10) {
        words += 'ten ';
        chunk = 0;
    }

    if (chunk > 0) {
        words += `${singleDigits[chunk]} `;
    }

    return words.trim();
}

function convertDecimalToWords(decimalStr) {
    const singleDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    return decimalStr.split('').map(digit => singleDigits[parseInt(digit, 10)]).join(' ');
}


// // Text-to-Speech Magic - Makes numbers talk!
// function speakResult() {
//     const speakBtn = document.getElementById('speak-btn');
//     const textToSpeak = document.getElementById('word-result').innerHTML;

//     // Stop any ongoing speech
//     if (window.speechSynthesis.speaking) {
//         window.speechSynthesis.cancel();
//         speakBtn.classList.remove('speaking');
//         return;
//     }

//     // Create and configure speech
//     const utterance = new SpeechSynthesisUtterance(textToSpeak);
//     utterance.rate = 0.9;  // Slightly slower for clarity
//     utterance.pitch = 1;
//     utterance.volume = 1;

//     // When speech starts
//     utterance.onstart = function() {
//         speakBtn.classList.add('speaking');
//     };

//     // When speech ends
//     utterance.onend = function() {
//         speakBtn.classList.remove('speaking');
//     };

//     // Launch the speech!
//     window.speechSynthesis.speak(utterance);
// }

// // Enable speak button when result is ready
// function enableSpeakButton() {
//     const speakBtn = document.getElementById('speak-btn');
//     const hasContent = document.getElementById('word-result').innerHTML.trim().length > 0;
//     speakBtn.disabled = !hasContent;
// }

function backspace() {
    if (right.length > 0) {
        right = right.slice(0, -1);
    } else if (operator.length > 0) {
        operator = '';
    } else if (left.length > 0) {
        left = left.slice(0, -1);
    }
    updateResult();
}

function calculateResult() {
    let result;
    const num1 = parseFloat(left);
    const num2 = parseFloat(right);

    if (isNaN(num1) || isNaN(num2)) {
        alert('Invalid input. Please enter valid numbers.');
        return;
    }

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                alert('Division by zero is not allowed.');
                return;
            }
            result = num1 / num2;
            break;
        default:
            alert('Invalid operator.');
            return;
    }

    left = result.toString();
    operator = '';
    right = '';
    const words = numberToWords(result);
    document.getElementById('word-result').innerHTML = words;
    updateResult();
   
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (!isNaN(key)) { // Check if the key is a number
        appendToResult(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        operatorToResult(key);
    } else if (key === 'Enter') {
        calculateResult();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearResult();
    } else if (key === '(' || key === ')') {
        bracketToResult(key);
    } else if (key === '.') {
        appendToResult(key);
    }
});
