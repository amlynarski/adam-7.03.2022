export type InfoData = [number, number, number?];

export type OrderBookMsg = {
  asks: InfoData[];
  bids: InfoData[];
  event?: string;
};
