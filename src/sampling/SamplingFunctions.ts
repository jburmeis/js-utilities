/** Generates a random float number between min (inclusive) and max (exclusive) */
export function sampleNumber(min: number, max: number): number {
    return min + (Math.random() * (max - min));
}

/** Generates a random integer between min (inclusive) and max (exclusive) */
export function sampleInteger(min: number, max: number): number {
    return Math.floor(min + (Math.random() * (max - min)));
}

/** Generates a random date between min (inclusive) and max (exclusive) */
export function sampleDate(min: Date, max: Date): Date {
    return new Date(sampleInteger(min.getTime(), max.getTime()));
}

/** Generates a random boolean given an optional the probability to be true (default = 0.5) */
export function sampleBoolean(probability: number = 0.5): boolean {
    return (Math.random() < probability);
}

/** Samples a random object from the given set via uniform sampling */
export function sampleObjects<T>(...values: Array<T>): T {
    if (values.length === 0) {
        throw new Error("Object collection is empty");
    }
    return values[sampleInteger(0, values.length)];
}

/** Generates a random float number from a given normal distribution */
export function sampleNormalDistribution(mean: number = 0, sigma: number = 1): number {
    // Implementation of the Marsaglia polar method
    let u, v, s;

    do {
        u = Math.random() * 2 - 1;
        v = Math.random() * 2 - 1;

        s = (u * u) + (v * v);
    } while (s >= 1.0);

    // Sample from (0,1) distribution
    const standardNormalSample = u * Math.sqrt((-2 * Math.log(s)) / s);

    // Transform to (mean, sigma) distribution
    return mean + (sigma * standardNormalSample);
}
