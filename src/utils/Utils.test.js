import {
  capitalizeText,
  createUUID,
  NumberValidator,
  getRoundedValue,
  getPosition,
  isNilOrEmpty,
  getFloatFormat,
} from "./Utils";

describe("utils", () => {
  it("capitalize first letter", () => {
    expect(capitalizeText("test")).toStrictEqual("Test");
    expect(capitalizeText()).toStrictEqual("");
  });

  it("createUUID", () => {
    expect(createUUID()).not.toStrictEqual(createUUID());
  });

  it("numberValidator", () => {
    expect(NumberValidator("abc")).toBeFalsy();
    expect(NumberValidator("123")).toBeTruthy();
    expect(NumberValidator("123.12")).toBeTruthy();
  });

  it("getRoundedValue", () => {
    expect(getRoundedValue(123.122222)).toStrictEqual(123.12);
    expect(getRoundedValue(0)).toStrictEqual(0);
    expect(getRoundedValue()).toStrictEqual("-");
  });

  it("getFloatFormat", () => {
    expect(getFloatFormat(27)).toStrictEqual("27.00");
    expect(getFloatFormat(0)).toStrictEqual(0);
  });

  describe("isNilOrEmpty", () => {
    it("with null as argument", () => {
      expect(isNilOrEmpty(null)).toBeTruthy();
    });

    it("without any argument", () => {
      expect(isNilOrEmpty()).toBeTruthy();
    });

    it("with empty string argument", () => {
      expect(isNilOrEmpty("")).toBeTruthy();
    });
  });

  describe("getPosition", () => {
    it("with null argument", () => {
      expect(getPosition()).toStrictEqual({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      });
    });

    it("with valid argument", () => {
      const el = {
        offsetLeft: 10,
        offsetTop: 10,
        offsetWidth: 10,
        offsetHeight: 10,
      };
      expect(getPosition(el)).toStrictEqual({
        top: 10,
        left: 10,
        right: 20,
        bottom: 20,
      });
    });
  });
});
