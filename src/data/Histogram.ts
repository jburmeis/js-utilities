export interface HistogramBin {
    key: string;
    size: number;
    scaledSize: number;
}

export enum HistogramBinScaling {
    /**
     * Scales bin sizes by (1 / number of datapoints)
     * The sum of all bin values will sum to 1.
     */
    ByNumDatapoints = "ByNumDatapoints",

    /**
     * Scales bin sizes by (1 / max bin size)
     * The largest bin will have size 1.
     */
    ByMaxBinSize = "ByMaxBinSize",
}

export default abstract class Histogram {

    public abstract getNumBins(): number;
    public abstract getNumDataPoints(): number;

    /**
     * Default scaling = HistogramBinScaling.ByNumDatapoints
     */
    public abstract getBins(scaling?: HistogramBinScaling): Array<HistogramBin>;

    public getBinsSortedByBinSize(sortDirection: "ascending" | "descending" = "descending", scaling?: HistogramBinScaling): Array<HistogramBin> {
        const bins = this.getBins(scaling);
        switch (sortDirection) {
            case "ascending":
                return bins.sort((bin1, bin2) => (bin1.size - bin2.size));
            case "descending":
                return bins.sort((bin1, bin2) => (bin2.size - bin1.size));
        }
    }

    public getBinsSortedByKey(sortDirection: "ascending" | "descending" = "ascending", scaling?: HistogramBinScaling): Array<HistogramBin> {
        const bins = this.getBins(scaling);
        switch (sortDirection) {
            case "ascending":
                return bins.sort((bin1, bin2) => bin1.key.localeCompare(bin2.key));
            case "descending":
                return bins.sort((bin1, bin2) => bin2.key.localeCompare(bin1.key));
        }
    }

}