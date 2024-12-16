export function umicrostoActualValue(number, decimals) {
    const divisor = Math.pow(10, decimals);
    return number / divisor;
}

export function actualtoUmicroValue(number, decimals) {
    const multiplyer = Math.pow(10, decimals);
    console.log({ number: number * multiplyer });
    return number * multiplyer;
}