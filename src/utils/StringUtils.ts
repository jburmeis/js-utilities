/**
 * Converts a number to string with a fixed number of decimal places.
 * Example: 12.781 => 12.78
 * Example: 12 => 12.00
 */
export function numberToFixedDecimals(number: number, numDecimals: number = 2): string {
    if (numDecimals <= 0)
        return Math.round(number).toFixed(0);

    const shiftFactor = Math.pow(10, numDecimals);
    return ((Math.round(number * shiftFactor)) / shiftFactor).toFixed(numDecimals);
}

/**
 * Converts a number to string with a fixed number of decimal places. 
 * If the input is integer, no decimal numbers will be added.
 * Example: 12.781 => 12.78
 * Example: 12 => 12
 */
export function numberToFixedDecimalsPreserveInt(number: number, numDecimals: number = 2): string {
    return Number.isInteger(number) ? number.toString() : numberToFixedDecimals(number, numDecimals);
}

/**
 * Creates a concatenated string of all input strings, separated by the separator string (default: ',')
 * Example: ["a","b","c"] => "a,b,c"
 * Optional: Provide prefix/suffix strings, to wrap all individual items:
 * Example: ["a","b","c"] => "'a','b','c'"
 * Example: ["a","b","c"] => "a$, b$, c$"
 */
export function arrayToSeparatedString(array: Array<string | number>, separator: string = ",", itemPrefix: string = "", itemSuffix: string = ""): string {
    let resultString = "";

    const numValues = array.length;
    for (let i = 0; i < numValues; i++) {
        resultString += `${itemPrefix}${array[i]}${itemSuffix}`;

        if (i < (numValues - 1)) {
            resultString += separator;
        }
    }

    return resultString;
}

/**
 * Creates a concatenated string of all input strings, separated by the separator string (default: ',')
 * Example: ["a","b","c"] => "a,b,c"
 * Optional: Provide prefix/suffix strings, to wrap all individual items:
 * Example: ["a","b","c"] => "'a','b','c'"
 * Example: ["a","b","c"] => "a$, b$, c$"
 */
export function setToSeparatedString(set: Set<string | number>, separator: string = ",", itemPrefix: string = "", itemSuffix: string = ""): string {
    return arrayToSeparatedString(Array.from(set), separator, itemPrefix, itemSuffix);
}

/**
 * Returns an array of indices for all occurrences of a given char in the input string.
 * This method only works with single characters, not query strings.
 */
export function getIndicesOfCharInString(input: string, queryChar: string): Array<number> {
    if (queryChar.length !== 1) {
        throw new Error("Parameter 'queryChar' must be of length 1");
    }

    let indices = [];
    for (let i = 0; i < input.length; i++) {
        if (input[i] === queryChar) {
            indices.push(i);
        }
    }

    return indices;
}

/**
 * Returns if at least one of the options is included in the input string.
 */
export function includesAtLeastOne(input: string, options: string[]): boolean {
    for (const option of options) {
        if (input.includes(option)) {
            return true;
        }
    }
    return false;
}

/**
 * Returns if at least one of the options is equal to the input string.
 */
export function matchesAtLeastOne(input: string, options: string[]): boolean {
    for (const option of options) {
        if (input === option) {
            return true;
        }
    }
    return false;
}

/**
 * Returns a string of defined length with random sequence of alphanumerical characters (upper + lowercase)
 */
export function newRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Turns a string in underscore-separated formats into human-readble form.
 * Example: 'my_text_description' => 'My Text Description'
 */
export function humanize(input: string): string {
    return input
        .split("_")
        .map(elem => elem.trim())
        .filter(elem => elem.length > 0)
        .map(elem => elem.charAt(0).toUpperCase() + elem.slice(1))
        .join(' ');
}

/**
 * Turns a string with common whitespace-separated words into camel-case form.
 * Example: 'My Text description' => 'myTextDescription'
 */
export function toCamelCase(input: string): string {
    const splits = input.trim().split(/\s+/);

    let resultStr = splits[0].toLowerCase();
    for (let i = 1; i < splits.length; i++) {
        resultStr += (splits[i][0].toUpperCase()) + splits[i].substring(1);
    }
    return resultStr;
}

/**
 * Turns a positive percentage floating point number (0-100) into a string, where the value is floored 
 * to integers in form '4%', and values below 1 are replaced with '< 1%'
 */
export function humanizePercentage(percentage: number): string {
    return (percentage === 0) ? "0 %" : (percentage < 1) ? "<1 %" : `${Math.floor(percentage)} %`;
}

/**
 * Cuts an input string at the end to have at most maxLength length.
 * An optional end replacement string can be set, that is added as a replacement (e.g. 'long descr...')
 * when a string is too long.
 * Note that the endReplacement string counts into the maxLength limit as well.
 */
export function shortenStringAtEnd(input: string, maxLength: number, endReplacement?: string): string {
    if (input.length <= maxLength) {
        return input;
    }

    maxLength = maxLength - (endReplacement?.length ?? 0);
    if (maxLength <= 0) {
        throw new Error("Possible string length is null or negative");
    }
    return `${input.slice(0, maxLength)}${endReplacement ?? ""}`;
}