

function strIntAddition(number1, number2) {
    // Get the maximum and minimum number according on their dimensions
    const [maxN, minN] = (number1.length > number2.length)
        ? [number1, number2]
        : [number2, number1];

    // Invert both numbers
    const maxNRev = maxN.split('').reverse();
    const minNRev = minN.split('').reverse();

    let result = '';

    // Make the addition
    let remainder = 0;
    for (let i = 0; i < maxN.length; i++) {
        const num1 = Number(maxNRev[i]);
        const num2 = Number(minNRev[i] ?? 0);

        // Make the current addition and set the remainder
        const curRes = (remainder + num1 + num2).toString();
        const has2digits = (curRes.length == 2);
        remainder = (has2digits) ? Number(curRes[0]) : 0;

        // Add the last digit to the final result
        result = curRes.at(-1) + result;
    };

    // Add the remainder
    if (remainder != 0) result = remainder.toString() + result;

    // Return the addition
    return result;
}


function strIntMultiplication(value, multiplier) {
    let result = '';

    // Make the multiplication from back to from
    let remainder = 0;
    for (const dig of value.split('').reverse()) {
        // Make the current multiplication
        const mult = ((Number(dig) * multiplier) + remainder).toString();

        // Check if the multiplication result has more than one digit
        const hasMoreDigits = (mult.length > 1);

        // Set the new remainder
        remainder = (hasMoreDigits)
            ? Number(mult.slice(0, mult.length - 1))
            : 0;

        result = mult.at(-1).toString() + result;
    }

    // Add the remainder
    if (remainder > 0) result = remainder.toString() + result;

    return result;
}

console.log(strIntMultiplication('923173981739813123', 3))

// 2769521945219439369
// 2769521945219439369