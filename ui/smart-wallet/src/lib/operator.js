export function umicrostoActualValue(number, decimals) {
    const divisor = Math.pow(10, decimals);
    return number / divisor;
}

export function actualtoUmicroValue(number, decimals) {
    const multiplier = Math.pow(10, decimals);
    return number * multiplier;
}