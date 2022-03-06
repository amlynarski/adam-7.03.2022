import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getUnsubscribeMsg, WS_SUBSCRIBE_MSG, WS_URL } from "./consts";
import { OrderBookMsg } from "../../types";
import { transformMsgToData } from "../../utils";

const emptyFn = () => undefined;

interface Props {
  connect: () => void;
  send: (data: string) => void;
  close: () => void;
  asksBidsData: OrderBookMsg;
  toggleMsg: () => void; // could be changed to setSubscribeMsg in future
}

export const OrderBookSocketContext = createContext<Props>({
  connect: emptyFn,
  send: (_data: string) => undefined,
  close: emptyFn,
  toggleMsg: () => undefined,
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
      console.log("---initialization");
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
    const unsubscribeMsg = getUnsubscribeMsg(subscribeMsg);
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

  /** subscribedMsg was changed and connection was closed, but we need to reconnect */
  useEffect(() => {
    if (!dataInitialized.current) {
      connect();
    }
  }, [subscribeMsg]);

  // todo move it outside from context and implement inside dedicated view
  const toggleMsg = useCallback(() => {
    close();

    setSubscribeMsg((prevState) => {
      if (prevState === WS_SUBSCRIBE_MSG.PI_ETHUSD) {
        return WS_SUBSCRIBE_MSG.PI_XBTUSD;
      } else {
        return WS_SUBSCRIBE_MSG.PI_ETHUSD;
      }
    });
  }, [close]);

  return (
    <OrderBookSocketContext.Provider
      value={{
        connect,
        send,
        close,
        toggleMsg,
        asksBidsData,
      }}
    >
      {children}
    </OrderBookSocketContext.Provider>
  );
};
export const OrderBookSocketContextConsumer = OrderBookSocketContext.Consumer;
