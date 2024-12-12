function generate12DigitGTIN() {
    // Start with '98' as the first two digits
    let gtin = '98';

    // Generate the next 9 digits randomly
    for (let i = 0; i < 9; i++) {
        gtin += Math.floor(Math.random() * 10);
    }

    // Calculate the check digit using Modulo 10 algorithm
    const calculateCheckDigit = (digits) => {
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            const digit = parseInt(digits[i], 10);
            // Multiply odd-positioned digits by 3 and even-positioned digits by 1
            sum += (i % 2 === 0 ? digit * 3 : digit);
        }
        const remainder = sum % 10;
        return remainder === 0 ? 0 : 10 - remainder;
    };

    const checkDigit = calculateCheckDigit(gtin);
    return gtin + checkDigit; // Return the complete 12-digit GTIN
}

// Example usage:
console.log(generate12DigitGTIN());
