// todo rename

import { InfoData, OrderBookMsg } from "../types";

const PRICE = 0;
const SIZE = 1;
const TOTAL = 2;

export const transformInfoData = (data: InfoData[]): InfoData[] => {
  // todo (check if need to check if values are sorted, or implement some error if not)

  let total = 0;
  return data.reduce((result, current) => {
    // todo in future handle the same prices
    // todo tests
    if (current[SIZE] !== 0) {
      /** remove zero size values */
      total = total + current[SIZE];
      result.push([...current, total]);
    }
    return result;
  }, []);
};

export const transformMsgToData = (msg: OrderBookMsg) => ({
  bids: transformInfoData(msg.bids),
  asks: transformInfoData(msg.asks),
});
