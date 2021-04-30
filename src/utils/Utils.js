import { isEmpty, round, toString } from "lodash";

export const capitalizeText = (text) => {
  if (text) {
    text = text.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
      match.toUpperCase()
    );
    return text;
  } else {
    return "";
  }
};

export const createUUID = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

export const NumberValidator = (value) => !!value.match(/^\d+(\.\d+)?$/);

export const getRoundedValue = (value) => {
  return value || value === 0 ? round(value, 2) : "-";
};

export const getFloatFormat = (value) => {
  return value ? parseFloat(value).toFixed(2) : value;
};

export const isNilOrEmpty = (value) => isEmpty(toString(value));

export const getPosition = (el) => ({
  left: el ? el.offsetLeft : 0,
  top: el ? el.offsetTop : 0,
  right: el ? el.offsetLeft + el.offsetWidth : 0,
  bottom: el ? el.offsetTop + el.offsetHeight : 0,
});
