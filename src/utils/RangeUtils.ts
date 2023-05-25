import { MinMaxPair } from "../structs/MinMaxPair";
import { OptionalRange } from "../structs/OptionalRange";

export enum RangeMatching {
    MaxIncluded = "MaxIncluded",
    MaxExcluded = "MaxExcluded",
}

export function matchesRange(value: number, range: MinMaxPair, mode: RangeMatching = RangeMatching.MaxExcluded): boolean {
    const { min, max } = range;
    if (value < min) {
        return false;
    }

    if (mode === RangeMatching.MaxIncluded) {
        if (value > max) {
            return false;
        }
    }
    else if (mode === RangeMatching.MaxExcluded) {
        if (value >= max) {
            return false;
        }
    }
    return true;
}

export function matchesOptionalRange(value: number, valueRange: OptionalRange | undefined | null, mode: RangeMatching = RangeMatching.MaxExcluded): boolean {
    if (!valueRange) { return Number.isFinite(value); }
    if ((valueRange.min === undefined) && (valueRange.max === undefined)) { return Number.isFinite(value); }

    if ((valueRange.min !== undefined) && value < valueRange.min) {
        return false;
    }

    if (valueRange.max !== undefined) {
        if ((mode === RangeMatching.MaxIncluded) && (value > valueRange.max)) {
            return false;
        }
        else if ((mode === RangeMatching.MaxExcluded) && (value >= valueRange.max)) {
            return false;
        }
    }

    return true;
}