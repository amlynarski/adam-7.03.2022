import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { throttle } from "../../../../utils";

import {
  getUnsubscribeMsg,
  initialState,
  SNAPSHOT,
  THROTTLE_TIME,
  WS_SUBSCRIBE_MSG,
  WS_URL,
} from "./consts";
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

export const OrderBookSocketContextProvider: FC = ({ children }) => {
  const ws = useRef<WebSocket>();
  const [subscribeMsg, setSubscribeMsg] = useState<WS_SUBSCRIBE_MSG>(
    WS_SUBSCRIBE_MSG.PI_XBTUSD
  );
  const currentDataState = useRef<OrderBookMsg>(initialState);

  const [asksBidsData, setAsksBidsData] = useState<OrderBookMsg>(initialState);
  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);

  const onError = useCallback(() => {
    // todo implement :)
  }, []);

  const onClose = useCallback(() => {
    setIsConnectionOpen(false);
  }, []);

  // linter disabled: expect arrow function. It is ok to keep it without unnecessary nesting
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleSetMsgState: (msg: OrderBookMsg) => void = useCallback(
    throttle(() => setAsksBidsData(currentDataState.current), THROTTLE_TIME),
    []
  );

  const onMessage = useCallback(
    (messageEvent: MessageEvent) => {
      const msg: OrderBookMsg = JSON.parse(messageEvent.data);

      if (!!msg.event) {
        return;
      }

      const isSnapshot = msg.feed.includes(SNAPSHOT);

      if (isSnapshot) {
        currentDataState.current = transformMsgToData(msg);
        setAsksBidsData(currentDataState.current);
      } else {
        currentDataState.current = transformMsgToData(
          currentDataState.current,
          msg
        );
        throttleSetMsgState(msg);
      }
    },
    [throttleSetMsgState]
  );

  const send = useCallback((data: string) => {
    ws.current?.send(data);
  }, []);

  const onOpen = useCallback(() => {
    setIsConnectionOpen(true);
  }, []);

  useEffect(() => {
    if (isConnectionOpen) {
      send(subscribeMsg);
    }
  }, [isConnectionOpen, subscribeMsg, send]);

  const close = useCallback(() => {
    setIsConnectionOpen(false);
    const unsubscribeMsg = getUnsubscribeMsg(subscribeMsg);
    send(unsubscribeMsg);
    ws?.current?.close();
  }, [send, subscribeMsg, ws]);

  const connect = useCallback(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.binaryType = "blob";
    ws.current.onopen = onOpen;
    ws.current.onerror = onError;
    ws.current.onmessage = onMessage;
    ws.current.onclose = onClose;
  }, [onOpen, onError, onMessage, onClose]);

  const toggleMsg = useCallback(() => {
    const unsubscribeMsg = getUnsubscribeMsg(subscribeMsg);
    send(unsubscribeMsg);

    setSubscribeMsg((prevState) => {
      if (prevState === WS_SUBSCRIBE_MSG.PI_ETHUSD) {
        return WS_SUBSCRIBE_MSG.PI_XBTUSD;
      } else {
        return WS_SUBSCRIBE_MSG.PI_ETHUSD;
      }
    });
  }, [send, subscribeMsg]);

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
