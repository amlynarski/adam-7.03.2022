import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { WS_SUBSCRIBE_MSG, WS_UNSUBCRRIBE_MSG, WS_URL } from "./consts";
import { InfoData, OrderBookMsg } from "../../types";
import { transformMsgToData } from "../../utils/utils";

const emptyFn = () => undefined;

export const OrderBookSocketContext = createContext({
  connect: emptyFn,
  send: (_data: string) => undefined,
  close: emptyFn,
  setSubscribeMsg: (_msg) => undefined, // todo rename to toggle and implement logic
});

export const OrderBookSocketContextProvider: FC = ({ children }) => {
  const ws = useRef<WebSocket>();
  const dataInitialized =
    useRef<boolean>(false); /** value used for setting snapshot */
  const [subscribeMsg, setSubscribeMsg] = useState<WS_SUBSCRIBE_MSG>(
    WS_SUBSCRIBE_MSG.PI_XBTUSD
  );
  const [asksBidsData, setAsksBidsData] = useState<OrderBookMsg>({
    asks: [], // todo think if not undefined
    bids: [],
  });

  const onOpen = useCallback(() => {
    ws.current.send(subscribeMsg);

    setTimeout(() => close(), 1000);
  }, [subscribeMsg]);

  const onError = useCallback(() => {
    // todo
  }, []);

  useEffect(() => {
    console.log("-----------------------");
    console.log("-- ", asksBidsData);
  }, [asksBidsData]);

  const onMessage = useCallback((messageEvent: MessageEvent) => {
    const msg: OrderBookMsg = JSON.parse(messageEvent.data);

    if (!!msg.event) {
      return;
    }

    if (!dataInitialized.current) {
      dataInitialized.current = true;
      console.log("initialize", msg);
      setAsksBidsData(transformMsgToData(msg));
    } else {
    }

    // console.log("--- msg", msg);
  }, []);

  const send = useCallback(
    (data: string) => {
      ws.current?.send(data);
    },
    [ws]
  );

  const close = useCallback(() => {
    console.log("close");
    const unsubscribeMsg =
      subscribeMsg === WS_SUBSCRIBE_MSG.PI_XBTUSD
        ? WS_UNSUBCRRIBE_MSG.PI_XBTUSD
        : WS_UNSUBCRRIBE_MSG.PI_ETHUSD; // todo think if handle with one variable or keep this condition
    send(unsubscribeMsg);
    ws.current.close();
    dataInitialized.current = false;
  }, [send, subscribeMsg, ws]);

  const connect = useCallback(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.binaryType = "blob";
    ws.current.onopen = onOpen;
    ws.current.onerror = onError;
    ws.current.onmessage = onMessage;
  }, [onOpen, onError, onMessage]);

  return (
    <OrderBookSocketContext.Provider
      value={{
        connect,
        send,
        close,
        setSubscribeMsg,
      }}
    >
      {children}
    </OrderBookSocketContext.Provider>
  );
};
export const OrderBookSocketContextConsumer = OrderBookSocketContext.Consumer;

/**
 * asks = sell, total = sum of lower
 * "asks": Array [
 *     Array [
 *       39001,
 *       1040,
 *     ],
 *     Array [
 *       39001.5,
 *       5029,
 *     ],
 *     Array [
 *       39003,
 *       0,
 *     ],
 *     Array [
 *       39005.5,
 *       28798,
 *     ],
 *     Array [
 *       39007,
 *       4370,
 *     ],
 *     Array [
 *       39023,
 *       20000,
 *     ],
 *     Array [
 *       39025.5,
 *       0,
 *     ],
 *     Array [
 *       39038.5,
 *       0,
 *     ],
 *     Array [
 *       39039,
 *       0,
 *     ],
 *     Array [
 *       39039.5,
 *       0,
 *     ],
 *     Array [
 *       39041.5,
 *       399999,
 *     ],
 *     Array [
 *       39042,
 *       1031005,
 *     ],
 *     Array [
 *       39050.5,
 *       0,
 *     ],
 *     Array [
 *       39052,
 *       59270,
 *     ],
 *     Array [
 *       39053.5,
 *       250000,
 *     ],
 *     Array [
 *       39182,
 *       123728,
 *     ],
 *   ],
 *
 *   bid = buy, total = sum of higher
 *   "bids": Array [
 *     Array [
 *       38802,
 *       117075,
 *     ],
 *     Array [
 *       38924.5,
 *       57550,
 *     ],
 *     Array [
 *       38935.5,
 *       20000,
 *     ],
 *     Array [
 *       38936.5,
 *       2996,
 *     ],
 *     Array [
 *       38964.5,
 *       14238,
 *     ],
 *     Array [
 *       38965,
 *       10000,
 *     ],
 *     Array [
 *       38965.5,
 *       30611,
 *     ],
 *   ],
 *   "feed": "book_ui_1",
 *   "product_id": "PI_XBTUSD",
 *
 * */
