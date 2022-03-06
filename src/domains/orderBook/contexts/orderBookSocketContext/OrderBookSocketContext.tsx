import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { throttle } from "../../../../utils";

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
  isConnectionOpen: boolean;
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
  isConnectionOpen: false,
});

const THROTTLE_TIME = 1000;

export const OrderBookSocketContextProvider: FC = ({ children }) => {
  const ws = useRef<WebSocket>();
  const isDataInitialized =
    useRef<boolean>(false); /** value used for setting snapshot */
  const [subscribeMsg, setSubscribeMsg] = useState<WS_SUBSCRIBE_MSG>(
    WS_SUBSCRIBE_MSG.PI_XBTUSD
  );
  const [asksBidsData, setAsksBidsData] = useState<OrderBookMsg>({
    asks: [],
    bids: [],
  });
  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);

  const onOpen = useCallback(() => {
    console.log("- onOpen");
    setIsConnectionOpen(true);
    ws.current.send(subscribeMsg);
  }, [subscribeMsg]);

  const onError = useCallback(() => {
    // todo
  }, []);

  const onClose = useCallback(() => {
    setIsConnectionOpen(false);
    console.log("- onClose");
  }, []);

  useEffect(() => {
    if (!isConnectionOpen) {
      isDataInitialized.current = false;
    }
  }, [isConnectionOpen]);

  const mergeNewAsksBidsDataWithOldValues = useCallback((msg) => {
    setAsksBidsData((prevState) => transformMsgToData(prevState, msg));
  }, []);

  const throttleSetMsgState = useCallback(
    throttle((msg) => mergeNewAsksBidsDataWithOldValues(msg), THROTTLE_TIME),
    [mergeNewAsksBidsDataWithOldValues]
  );

  const onMessage = useCallback(
    (messageEvent: MessageEvent) => {
      const msg: OrderBookMsg = JSON.parse(messageEvent.data);

      if (!!msg.event) {
        return;
      }

      if (!isDataInitialized.current) {
        console.log("---initialization");
        isDataInitialized.current = true;
        setAsksBidsData(transformMsgToData(msg));
      } else {
        throttleSetMsgState(msg); // todo check
      }
    },
    [throttleSetMsgState, isConnectionOpen]
  );

  const send = useCallback((data: string) => {
    ws.current?.send(data);
  }, []);

  const close = useCallback(() => {
    console.log("close");
    const unsubscribeMsg = getUnsubscribeMsg(subscribeMsg);
    send(unsubscribeMsg);
    ws.current.close();
  }, [send, subscribeMsg, ws]);

  const connect = useCallback(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.binaryType = "blob";
    ws.current.onopen = onOpen;
    ws.current.onerror = onError;
    ws.current.onmessage = onMessage;
    ws.current.onclose = onClose;
  }, [onOpen, onError, onMessage]);

  const toggleMsg = useCallback(() => {
    /** todo can be moved outside from context and implement inside dedicated view to support more pairs */
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
        isConnectionOpen,
      }}
    >
      {children}
    </OrderBookSocketContext.Provider>
  );
};
export const OrderBookSocketContextConsumer = OrderBookSocketContext.Consumer;
