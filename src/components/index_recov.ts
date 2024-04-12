//index.ts
import { WebRawHID } from "./webRawHID";
import { WebUsbComInterface } from "./webUsbComInterface";
import { createApp } from 'vue';
import App from '../App.vue'; // Adjust the path as necessary

// Ensure this runs when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createApp(App).mount('#vue-keyboard-app');
});


let com: WebUsbComInterface;

const consoleLength = 1000000;


/*if (!(navigator as any).serial) {
  alert("Please use chrome or edge");
}*/

let connectButton = document.getElementById("connect");

let updateTimerId: number; // Use number for browser environment

// When setting the interval:
updateTimerId = window.setInterval(updateConsole, 50);

// When clearing the interval:
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
        await com.open(() => {}, {}); // Pass an empty function as the first argument
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

// Clear button logic with null check
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

// This function might exist in index.ts or wherever you handle the HID data
function dataReceiveHandler(msg: Uint8Array) {
  const text = new TextDecoder().decode(msg);
  recvLine += text;

  // Assuming each message is separated by a newline
  const lines = text.split('|').map(line => line.trim()).filter(line => line);

  lines.forEach(line => {
    const parts = line.match(/\((\d+),(\d+)\) Rescale: (\d+)/);
    console.log("found match")
    if (parts) {
      const [, row, col, rescale] = parts;
      console.log(parts)
      // Emit an event with parsed data (this part needs adaptation to fit your app architecture)
      document.dispatchEvent(new CustomEvent('hid-data', {
        detail: { row: parseInt(row), col: parseInt(col), rescale: parseInt(rescale) }
      }));
    }
  });
}
