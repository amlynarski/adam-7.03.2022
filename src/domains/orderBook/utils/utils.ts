// todo rename

import { InfoData, OrderBookMsg, PRICE, SIZE } from "../types";

export const sortAsc = (a: InfoData, b: InfoData) => a[PRICE] - b[PRICE];
export const sortDesc = (a: InfoData, b: InfoData) => b[PRICE] - a[PRICE];

export const transformInfoData = (
  data: InfoData[],
  newData?: InfoData[],
  sortFunc?: (a: InfoData, b: InfoData) => number
): InfoData[] => {
  /** if newData is defined then merge arrays and put newData at the beginning
   * then sort it -> newData will be always before old values (in case of duplications)
   * */
  const arr = newData
    ? [...newData, ...data].sort(sortFunc)
    : data.sort(sortFunc);

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
      result.push([current[PRICE], current[SIZE], total]);
    }
    previousElement = current;
    return result;
  }, []);
};

export const transformMsgToData = (
  msg: OrderBookMsg,
  newMsg?: OrderBookMsg
) => ({
  asks: transformInfoData(msg.asks, newMsg?.asks, sortAsc),
  bids: transformInfoData(msg.bids, newMsg?.bids, sortDesc),
});
