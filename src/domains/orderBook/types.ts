export type InfoData = [number, number, number?];

export type OrderBookMsg = {
  asks: InfoData[];
  bids: InfoData[];
  event?: string;
  feed?: string;
  product_id?: string;
};

export const PRICE = 0;
export const SIZE = 1;
export const TOTAL = 2;
