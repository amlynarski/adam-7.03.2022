import { createContext, FC, useCallback, useRef, useState } from "react";

import { WS_SUBSCRIBE_MSG, WS_UNSUBCRRIBE_MSG, WS_URL } from "./consts";
import { OrderBookMsg } from "../../types";
import { sortAsc, sortDesc, transformMsgToData } from "../../utils/utils";

const emptyFn = () => undefined;

interface Props {
  connect: () => void;
  send: (data: string) => void;
  close: () => void;
  asksBidsData: OrderBookMsg;
}

export const OrderBookSocketContext = createContext<Props>({
  connect: emptyFn,
  send: (_data: string) => undefined,
  close: emptyFn,
  // setSubscribeMsg: (_msg) => undefined, // todo rename to toggle and implement logic
  asksBidsData: {
    asks: [],
    bids: [],
  },
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

    setTimeout(() => close(), 10000);
  }, [subscribeMsg]);

  const onError = useCallback(() => {
    // todo
  }, []);

  const onMessage = useCallback((messageEvent: MessageEvent) => {
    const msg: OrderBookMsg = JSON.parse(messageEvent.data);

    if (!!msg.event) {
      return;
    }

    if (!dataInitialized.current) {
      dataInitialized.current = true;
      setAsksBidsData(transformMsgToData(msg));
    } else {
      setAsksBidsData((prevState) => transformMsgToData(prevState, msg));
    }
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
        // setSubscribeMsg,
        asksBidsData,
      }}
    >
      {children}
    </OrderBookSocketContext.Provider>
  );
};
export const OrderBookSocketContextConsumer = OrderBookSocketContext.Consumer;
