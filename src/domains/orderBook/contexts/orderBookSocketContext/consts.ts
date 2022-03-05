export const WS_URL = "wss://www.cryptofacilities.com/ws/v1";
export enum WS_SUBSCRIBE_MSG {
  PI_XBTUSD = `{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}`,
  PI_ETHUSD = `{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}`,
}
export enum WS_UNSUBCRRIBE_MSG { // todo think if can be corelated with above
  PI_XBTUSD = `{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}`,
  PI_ETHUSD = `{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}
`,
}
