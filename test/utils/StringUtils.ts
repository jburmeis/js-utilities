
import { expect } from 'chai';
import { 
    arrayToSeparatedString, 
    getIndicesOfCharInString, 
    humanize, 
    humanizePercentage, 
    includesAtLeastOne, 
    shortenStringAtEnd, 
    matchesAtLeastOne,
    newRandomId, 
    numberToFixedDecimals, 
    numberToFixedDecimalsPreserveInt, 
    setToSeparatedString, 
    toCamelCase 
} from '../../src';

describe('StringUtils', () => {

    it('numberToFixedDecimals', () => {
        expect(numberToFixedDecimals(1.0, 1)).to.equal("1.0");
        expect(numberToFixedDecimals(1.0, 2)).to.equal("1.00");
        expect(numberToFixedDecimals(1.234, 2)).to.equal("1.23");
        expect(numberToFixedDecimals(1.237, 2)).to.equal("1.24");
        expect(numberToFixedDecimals(1.237, 3)).to.equal("1.237");
        expect(numberToFixedDecimals(1.237, 4)).to.equal("1.2370");
        expect(numberToFixedDecimals(-1.237, 2)).to.equal("-1.24");
        expect(numberToFixedDecimals(10.237, 3)).to.equal("10.237");
        expect(numberToFixedDecimals(0.237, 3)).to.equal("0.237");
    });

    it('numberToFixedDecimalsPreserveInt', () => {
        expect(numberToFixedDecimalsPreserveInt(1.0, 1)).to.equal("1");
        expect(numberToFixedDecimalsPreserveInt(1.0, 2)).to.equal("1");
        expect(numberToFixedDecimalsPreserveInt(1.234, 2)).to.equal("1.23");
        expect(numberToFixedDecimalsPreserveInt(1.237, 2)).to.equal("1.24");
        expect(numberToFixedDecimalsPreserveInt(1.237, 3)).to.equal("1.237");
        expect(numberToFixedDecimalsPreserveInt(1.237, 4)).to.equal("1.2370");
        expect(numberToFixedDecimalsPreserveInt(-1.237, 2)).to.equal("-1.24");
        expect(numberToFixedDecimalsPreserveInt(10.237, 3)).to.equal("10.237");
        expect(numberToFixedDecimalsPreserveInt(0.237, 3)).to.equal("0.237");
        expect(numberToFixedDecimalsPreserveInt(0.0, 3)).to.equal("0");
        expect(numberToFixedDecimalsPreserveInt(-10.0, 3)).to.equal("-10");
    });

    it('arrayToSeparatedString', () => {
        const inputArray = ["a", "b", "c"];

        expect(arrayToSeparatedString(inputArray, ",")).to.equal("a,b,c");
        expect(arrayToSeparatedString(inputArray, " ")).to.equal("a b c");
        expect(arrayToSeparatedString(inputArray, ", ")).to.equal("a, b, c");
        expect(arrayToSeparatedString(["a", "b"], ",")).to.equal("a,b");
        expect(arrayToSeparatedString(["a"], ",")).to.equal("a");
        expect(arrayToSeparatedString(["aa", "abc", "abcd"], ",")).to.equal("aa,abc,abcd");
        expect(arrayToSeparatedString([1, 4, 2], ", ")).to.equal("1, 4, 2");
        expect(arrayToSeparatedString([1, -4, 2.4], ", ")).to.equal("1, -4, 2.4");

        expect(arrayToSeparatedString(inputArray, ", ", "", "$")).to.equal("a$, b$, c$");
        expect(arrayToSeparatedString(inputArray, ", ", "%", "$")).to.equal("%a$, %b$, %c$");
        expect(arrayToSeparatedString(inputArray, ", ", "%")).to.equal("%a, %b, %c");
    });

    it('setToSeparatedString', () => {
        const inputSet = new Set<string>(["a", "b", "c"]);

        // Caution: These tests only work because sets are stored sorted internally in this VM implementation.
        expect(setToSeparatedString(inputSet, ",")).to.equal("a,b,c");
        expect(setToSeparatedString(inputSet, " ")).to.equal("a b c");
        expect(setToSeparatedString(inputSet, ", ")).to.equal("a, b, c");
        expect(setToSeparatedString(new Set<string>(["a", "b"]), ",")).to.equal("a,b");
        expect(setToSeparatedString(new Set<string>(["a"]), ",")).to.equal("a");
        expect(setToSeparatedString(new Set<string>(["aa", "abc", "abcd"]), ",")).to.equal("aa,abc,abcd");
        expect(setToSeparatedString(new Set<number>([1, 4, 2]), ", ")).to.equal("1, 4, 2");
        expect(setToSeparatedString(new Set<number>([1, -4, 2.4]), ", ")).to.equal("1, -4, 2.4");

        expect(setToSeparatedString(inputSet, ", ", "", "$")).to.equal("a$, b$, c$");
        expect(setToSeparatedString(inputSet, ", ", "%", "$")).to.equal("%a$, %b$, %c$");
        expect(setToSeparatedString(inputSet, ", ", "%")).to.equal("%a, %b, %c");

    });

    it('getIndicesOfCharInString', () => {
        expect(getIndicesOfCharInString("abcabcabca", "a")).to.eql([0,3,6,9]);
        expect(getIndicesOfCharInString("abc abc abc a", "a")).to.eql([0,4,8,12]);
        expect(getIndicesOfCharInString("abcabcabca", "b")).to.eql([1,4,7]);
        expect(getIndicesOfCharInString("abcabcabca", "d")).to.eql([]);
    });

    it('includesAtLeastOne', () => {
        expect(includesAtLeastOne("test array value image", ["picture", "value"])).to.be.true;
        expect(includesAtLeastOne("test array value image", ["picture", "mountain"])).to.be.false;
        expect(includesAtLeastOne("test array value image", ["picture", "ray"])).to.be.true;
        expect(includesAtLeastOne("test array value image", [])).to.be.false;
        expect(includesAtLeastOne("abcabcabca", ["cca", "cab"])).to.be.true;
        expect(includesAtLeastOne("abcabcabca", [" cca", " cab"])).to.be.false;
    });

    it('matchesAtLeastOne', () => {
        expect(matchesAtLeastOne("test", ["picture", "test", "value"])).to.be.true;
        expect(matchesAtLeastOne("test", ["picture", "value"])).to.be.false;
        expect(matchesAtLeastOne("test", ["test"])).to.be.true;
        expect(matchesAtLeastOne("test", [])).to.be.false;
        expect(matchesAtLeastOne("test", ["tes", "est", "t", "test "])).to.be.false;
    });

    it('newRandomId', () => {
        const result1 = newRandomId(10);
        const result2 = newRandomId(10);
        const result3 = newRandomId(10);

        expect(result1.length).to.eql(10);
        expect(result2.length).to.eql(10);
        expect(result3.length).to.eql(10);
        expect(result1).to.not.eql(result2);
        expect(result1).to.not.eql(result3);
        expect(result2).to.not.eql(result3);

        const result4 = newRandomId(5);
        expect(result4.length).to.eql(5);
    });

    it('humanize', () => {
        expect(humanize("my_text_description")).to.eql("My Text Description");
        expect(humanize("my_text description")).to.eql("My Text description");
        expect(humanize("_my_text_description")).to.eql("My Text Description");
        expect(humanize("_my_text_description_")).to.eql("My Text Description");
        expect(humanize("_my_text_description_")).to.eql("My Text Description");
        expect(humanize("  _my_text_description_ ")).to.eql("My Text Description");
        expect(humanize("_my_ text _description_")).to.eql("My Text Description");
    });

    it('toCamelCase', () => {
        expect(toCamelCase("my text description")).to.eql("myTextDescription");
        expect(toCamelCase("my   Text  description")).to.eql("myTextDescription");
        expect(toCamelCase("My text Description")).to.eql("myTextDescription");
        expect(toCamelCase("Text")).to.eql("text");
        expect(toCamelCase("")).to.eql("");
    });

    it('humanizePercentage', () => {
        expect(humanizePercentage(12)).to.eql("12 %");
        expect(humanizePercentage(56.73)).to.eql("56 %");
        expect(humanizePercentage(100)).to.eql("100 %");
        expect(humanizePercentage(1)).to.eql("1 %");
        expect(humanizePercentage(0.7)).to.eql("<1 %");
        expect(humanizePercentage(0.2)).to.eql("<1 %");
        expect(humanizePercentage(0)).to.eql("0 %");
    });

    it('shortenStringAtEnd', () => {
        expect(shortenStringAtEnd("ABC", 3)).to.eql("ABC");
        expect(shortenStringAtEnd("ABCDEFG", 3)).to.eql("ABC");
        expect(shortenStringAtEnd("ABCDEF", 6, "...")).to.eql("ABCDEF");
        expect(shortenStringAtEnd("ABCDEFGH", 6, "...")).to.eql("ABC...");
        expect(shortenStringAtEnd("ABCDEFGH", 6, "")).to.eql("ABCDEF");
        expect(shortenStringAtEnd("", 6, "...")).to.eql("");
        expect(() => shortenStringAtEnd("ABCDEFG", 3, "...")).to.throw;
    });

});

