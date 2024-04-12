import { WebUsbComInterface } from "./webUsbComInterface";

class WebRawHID implements WebUsbComInterface {
  private receiveCallback: ((msg: Uint8Array) => void) | null = null;
  private closeCallback: (() => void) | null = null;

  private port: any | null = null;

  private _connected: boolean = false;
  get connected() {
    return this._connected;
  }

  setReceiveCallback(recvHandler: ((msg: Uint8Array) => void) | null) {
    this.receiveCallback = (e: any) => {
      if (recvHandler) {
        recvHandler(new Uint8Array(e.data.buffer).filter((x) => x != 0));
      }
    };
    this.port?.addEventListener("inputreport", this.receiveCallback);
  }

  setErrorCallback() {
    // Use this method to handle errors, make sure you call this method if errors occur
  }

  setCloseCallback(handler: () => void) {
    this.closeCallback = handler;
  }

  async open(onConnect: () => void) {
    if (!(navigator as any).hid) {
      console.error("WebHID is not supported by this browser.");
      return;
    }

    const devices = await (navigator as any).hid.requestDevice({
      filters: [{ usagePage: 0xff31, usage: 0x74 }]
    });

    if (!devices.length) {
      console.error("No device selected.");
      return;
    }

    this.port = devices[0];

    try {
      await this.port.open();
    } catch (e) {
      console.error("Failed to open device:", e);
      return Promise.reject(e);
    }

    this._connected = true;
    onConnect?.();
  }

  async close() {
    this.closeCallback?.();

    if (this.port) {
      try {
        await this.port.close();
        this._connected = false;
        this.port = null;
      } catch (e) {
        console.error("Failed to close device:", e);
      }
    }
  }

  async writeString(_msg: string) {
    throw new Error("writeString method not implemented.");
  }

}

export { WebRawHID };
