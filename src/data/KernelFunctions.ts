export type KernelFunction = (x: number) => number;

export enum KernelFunctions {
    Gaussian = "Gaussian",
    Epanechnikov = "Epanechnikov",
    Quartic = "Quartic",
    Cosine = "Cosine",
}

export function getKernel(kernel: KernelFunctions): KernelFunction {
    switch (kernel) {
        case KernelFunctions.Gaussian:
            return gaussianKernel;
        case KernelFunctions.Epanechnikov:
            return epanechnikovKernel;
        case KernelFunctions.Quartic:
            return quarticKernel;
        case KernelFunctions.Cosine:
            return cosineKernel;
    }
}

export function gaussianKernel(x: number): number {
    return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

export function epanechnikovKernel(x: number): number {
    if (Math.abs(x) <= 1) {
        return (3 / 4) * (1 - x * x);
    } else return 0;
}

export function quarticKernel(x: number): number {
    if (Math.abs(x) <= 1) {
        const xTemp = (1 - x * x);
        return (15 / 16) * xTemp * xTemp;
    } else return 0;
}

export function cosineKernel(x: number): number {
    if (Math.abs(x) <= 1) {
        return (Math.PI / 4) * Math.cos((Math.PI / 2) * x);
    } else return 0;
}