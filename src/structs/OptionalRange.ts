export type OptionalRange = {
    min?: number;
    max?: number;
};

export function createOptionalRange(min: number | undefined | null, max: number | undefined | null): OptionalRange {
    if (min != null && max != null) {
        if (min > max) {
            throw new Error("max must be greater than min");
        }
    }
    return {
        min: min ?? undefined,
        max: max ?? undefined,
    }
}
