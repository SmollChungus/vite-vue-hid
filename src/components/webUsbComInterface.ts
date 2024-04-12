interface WebUsbComInterface {
  connected: boolean;
  setReceiveCallback(recvHandler: ((msg: Uint8Array) => void) | null): void;
  setCloseCallback(handler: () => void | null): void;
  open(onConnect: () => void | null, param: object): Promise<void>;
  close(): Promise<void>;
  writeString(msg: string): Promise<void>;
}

export type { WebUsbComInterface };
