/**
 * This is a utilty class to encode/decode a set of index numbers in a compact string representation,
 * that is more suitable to transfer than a (potentially large) number array.
 */
export default class IndexEncoder {
    private readonly numBits: number;
    private readonly array: Uint8Array;

    private constructor(length: number) {
        this.numBits = length;
        const numBytes = Math.ceil(this.numBits / 8);
        this.array = new Uint8Array(numBytes);
    }

    public static fromLength(length: number): IndexEncoder {
        return new IndexEncoder(length);
    }

    public static fromIndices(indices: Iterable<number>): IndexEncoder {
        // Find max index
        let maxIndex = 0;
        for(const idx of indices){
            if(idx > maxIndex) { 
                maxIndex = idx;
            }
        }

        // Create fitting encoder
        const instance = new IndexEncoder(maxIndex);
        for(const idx of indices){
            instance.set(idx);
        }

        return instance;
    }

    public static fromKey(key: string) {
        const instance = new IndexEncoder(key.length * 8);

        for(let i = 0; i < key.length; i++) {
            instance.array[i] = key[i].charCodeAt(0);
        }

        return instance;
    }

    public setAll(){
        for(let i = 0; i < this.array.length; i++){
            this.array[i] = 255;
        }
    }

    public clearAll(){
        for(let i = 0; i < this.array.length; i++){
            this.array[i] = 0;
        }
    }

    public isSet(idx: number): boolean {
        if(idx < 0 || idx > this.numBits){
            return false;
        }
        const byteIdx = Math.floor(idx / 8);
        const bitIdx = idx % 8;

        return ((this.array[byteIdx] >> bitIdx) & 1) === 1;
    }

    public set(idx: number) {
        if(idx < 0 || idx > this.numBits){
            throw new Error("Index out or range");
        }
        const byteIdx = Math.floor(idx / 8);
        const bitIdx = idx % 8;

        this.array[byteIdx] = this.array[byteIdx] | (1 << bitIdx);
    }

    public clear(idx: number) {
        if(idx < 0 || idx > this.numBits){
            throw new Error("Index out or range");
        }
        const byteIdx = Math.floor(idx / 8);
        const bitIdx = idx % 8;

        this.array[byteIdx] = this.array[byteIdx] & (~(1 << bitIdx));
    }

    public numSet(): number {
        return this.array.reduce((sum, current) => sum += this.countSetBits(current), 0);
    }

    public toKey(): string {
        return String.fromCharCode(...this.array);
    }

    private countSetBits(value: number) {
        let count = 0;
        while (value) {
            count += value & 1;
            value >>= 1;
        }
        return count;
    }

}