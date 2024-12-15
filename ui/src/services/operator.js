export function umicrostoActualValue(number, decimals) {
    const divisor = Math.pow(10, decimals);
    return number / divisor;
}