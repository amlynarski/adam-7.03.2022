// todo rename

import { InfoData, OrderBookMsg } from "../types";

const PRICE = 0;
const SIZE = 1;

export const sortAsc = (a: InfoData, b: InfoData) => a[PRICE] - b[PRICE];
export const sortDesc = (a: InfoData, b: InfoData) => b[PRICE] - a[PRICE];

export const transformInfoData = (
  // todo tests
  data: InfoData[],
  newData?: InfoData[],
  sortFunc?: (a: InfoData, b: InfoData) => number
): InfoData[] => {
  /** if newData is defined then merge arrays and put newData at the beginning
   * then sort it -> newData will be always before old values (in case of duplications)
   * */
  const arr = newData ? [...newData, ...data].sort(sortFunc) : data;

  let total = 0;
  let previousElement: InfoData = [0, 0];
  return arr.reduce((result, current) => {
    if (current[PRICE] === previousElement[PRICE]) {
      /** if previous element had the same price then skip current element*/
      previousElement = current;
      return result;
    }
    if (current[SIZE] !== 0) {
      /** remove zero size values */
      total = total + current[SIZE];
      result.push([...current, total]);
    }
    previousElement = current;
    return result;
  }, []);
};

export const transformMsgToData = (
  msg: OrderBookMsg,
  newMsg?: OrderBookMsg
) => ({
  bids: transformInfoData(msg.bids, newMsg?.bids, sortAsc),
  asks: transformInfoData(msg.asks, newMsg?.asks, sortDesc),
});
