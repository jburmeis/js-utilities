/**
 * Provides functions to handle common operations with numbers, mostly concerning integer operations.
 */

import { MinMaxPair } from "../structs/MinMaxPair";

export type NiceRange = {
    readonly min: number;
    readonly max: number;
    readonly numTicks: number;
    readonly tickSpacing: number;
}

/**
 * Returns a 'nice' value range and a set of 'nice' sub-ticks within this range, suitable for a human-readable presentation of data bins.
 * @param preferedNumTicks (optional) A hint how many ticks should be created. This is only a soft constraint for the algorithm, and 
 * it is unlikely that the resulting number of ticks will be exactly this.
 * 
 * Implementation based on: http://erison.blogspot.de/2011/07/algorithm-for-optimal-scaling-on-chart.html
 */
 export function createNiceRange(min: number, max: number, preferedNumTicks = 10): NiceRange {
    const range = niceNumber(max - min, false);
    const tickSpacing = niceNumber(range / (preferedNumTicks - 1), true);
    const niceMin = Math.floor(min / tickSpacing) * tickSpacing;
    const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;
    const numTicks = Math.floor((niceMax - niceMin) / tickSpacing);

    return {
        tickSpacing: tickSpacing,
        min: niceMin,
        max: niceMax,
        numTicks: numTicks,
    }
}

function niceNumber(dataRange: number, roundResult: boolean): number {
    // Exponent of data range
    const exponent = Math.floor(Math.log10(dataRange));

    // Factional part of data range
    const fraction = dataRange / Math.pow(10, exponent);

    // Rounded version of fraction
    let niceFraction;

    if (roundResult) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}

/**
 * Clamps the input value into the range specified by the min and max parameters (both inclusive, both optional for open-ended ranges)
 */
export function clamp(value: number, min: number | null, max: number | null): number {
    if (min !== null && value < min) {
        return min;
    }
    if (max !== null && value > max) {
        return max;
    }
    return value;
}

/**
 * Converts a number to integer.
 */
export function toInt(value: number): number {
    return (value > 0) ? Math.floor(value) : Math.ceil(value);
}

/**
 * Casts the input value to int, and clamps it into the range specified by the min and max parameters (both inclusive, both optional for open-ended ranges)
 */
export function toIntAndClamp(value: number, min: number | null, max: number | null): number {
    return clamp(toInt(value), min, max);
}

/**
 * Casts the input value to int, and clamps it into the min-bounded open range
 */
export function toIntAndClampMin(value: number, min: number): number {
    return clamp(toInt(value), min, null);
}

/**
 * Casts the input value to int, and clamps it into the max-bounded open range
 */
export function toIntAndClampMax(value: number, max: number): number {
    return clamp(toInt(value), null, max);
}

/**
 * Tests if two floating point numbers are almost equal.
 * Source: https://floating-point-gui.de/errors/comparison/
 */
export function almostEqual(value1: number, value2: number, epsilon = Number.EPSILON): boolean {
    // Handles infinities
    if (value1 === value2) {
        return true;
    }

    const abs1 = Math.abs(value1);
    const abs2 = Math.abs(value2);
    const diff = Math.abs(value1 - value2);

    // one input is zero, or both are extremely close to it
    if (value1 == 0 || value2 == 0 || (abs1 + abs2) < Number.MIN_VALUE) {
        // relative error is less meaningful here
        return diff < (epsilon * Number.MIN_VALUE);
    }

    // use relative error
    else {
        return diff / Math.min((abs1 + abs2), Number.MAX_VALUE) < epsilon;
    }
}

/**
 * For UI slider components: Given a value range (min, max) returns a nice step size.
 */
export function getNiceStepSize(min: number, max: number): number {
    return Math.pow(10, Math.floor(Math.log10(max - min) - 2));
}

/**
 * For UI slider components: Given a value range (min, max) returns a nice initial position
 * of a range slider.
 */
export function getNiceInitialStepRange(min: number, max: number, stepSize: number): MinMaxPair {
    const range = max - min;
    const initMin = min + stepSize * Math.floor((0.25 * range) / stepSize);
    const initMax = min + stepSize * Math.floor((0.75 * range) / stepSize);
    return { min: initMin, max: initMax };
}