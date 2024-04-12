//index.ts
import { WebRawHID } from "./webRawHID";
import { WebUsbComInterface } from "./webUsbComInterface";
import { createApp } from 'vue';
import App from '../App.vue'; 

document.addEventListener('DOMContentLoaded', () => {
  createApp(App).mount('#vue-keyboard-app');
});


let com: WebUsbComInterface;

const consoleLength = 1000000;



let connectButton = document.getElementById("connect");

let updateTimerId: number; 

updateTimerId = window.setInterval(updateConsole, 50);

window.clearInterval(updateTimerId);

if (connectButton) {
  connectButton.onclick = async () => {
    if (com?.connected) {
      connectButton.innerText = "Connect";
      clearInterval(updateTimerId);
      await com.close();
    } else {
      try {
        com = new WebRawHID();
        await com.open(() => {}, {}); 
        com.setReceiveCallback(dataReceiveHandler);
        connectButton.innerText = "Disconnect";
        updateTimerId = setInterval(updateConsole, 50);
      } catch (e) {
        console.error(e);
      }
    }
  };
} else {
  console.error('Connect button not found');
}

const hidConsole = document.getElementById("console");

let recvLine = "";

const clearButton = document.getElementById("clear");
if (clearButton) {
  clearButton.onclick = () => {
    if (hidConsole) {
      hidConsole.innerHTML = "";
    }
  };
} else {
  console.error('Clear button not found');
}


const saveButton = document.getElementById("save");
if (saveButton) {
  saveButton.onclick = () => {
  const download = document.getElementById("download-file") as HTMLAnchorElement;
  const hidConsole = document.getElementById("console");

  if (download && hidConsole) {
    const date = new Date(Date.now());
    const padd2 = (str: number) => ("00" + str.toString()).slice(-2);
    
    download.download = `${date.getFullYear()}${padd2(date.getMonth() + 1)}${padd2(date.getDate())}${padd2(date.getHours())}${padd2(date.getMinutes())}${padd2(date.getSeconds())}.txt`;
    const blob = new Blob([hidConsole.innerHTML], { type: "text/plain" });
    download.href = URL.createObjectURL(blob);
    download.click();
  } else {
    console.error('Either the download link or console element does not exist in the DOM.');
  }
};
} else {
  console.error('Save button not found');
}


function updateConsole() {
  if (hidConsole) {
    hidConsole.insertAdjacentText("beforeend", recvLine);
    recvLine = "";

    const autoScrollCheckbox = document.getElementById("autoscroll") as HTMLInputElement;
    if (autoScrollCheckbox && autoScrollCheckbox.checked) {
      hidConsole.scrollTop = hidConsole.scrollHeight;
    }

    if (hidConsole.innerHTML.length > consoleLength) {
      hidConsole.innerHTML = hidConsole.innerHTML.slice(-consoleLength);
    }
  }
}

function dataReceiveHandler(msg: Uint8Array) {
  const text = new TextDecoder().decode(msg);
  recvLine += text;

  const lines = text.split('|').map(line => line.trim()).filter(line => line);

  lines.forEach(line => {
    const parts = line.match(/\((\d+),(\d+)\) Rescale: (\d+)/);
    console.log("found match")
    if (parts) {
      const [, row, col, rescale] = parts;
      console.log(parts)
      document.dispatchEvent(new CustomEvent('hid-data', {
        detail: { row: parseInt(row), col: parseInt(col), rescale: parseInt(rescale) }
      }));
    }
  });
}
