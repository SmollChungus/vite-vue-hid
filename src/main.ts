// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { WebRawHID } from "./components/webRawHID.ts";
import { WebUsbComInterface } from "./components/webUsbComInterface.ts";

let com: WebUsbComInterface;
let updateTimerId: number;

document.addEventListener('DOMContentLoaded', () => {
    const app = createApp(App);
    app.mount('#app');

    setupPCBConnection();
    generateRandomBlobbyGradient();
});

function setupPCBConnection() {
    const connectButton = document.getElementById("connect");
    if (connectButton) {
        connectButton.addEventListener('click', async () => {
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
        });
    } else {
        console.error("Connect button not found.");
    }
}

function generateRandomBlobbyGradient() {
    const colors = ['#BF8F81', '#FFBEAC', '#6B949F', '#FFBEAC'];
    const gradient = colors.map((color, index) => {
        const size = 30 + Math.random() * 70; // random size from 30% to 100%
        const position = Math.round(Math.random() * 100);
        return `radial-gradient(circle at ${position}% ${position}%, ${color} ${size}%, transparent 70%)`;
    }).join(', ');

    document.body.style.backgroundImage = gradient;
}

function updateConsole() {
    const hidConsole = document.getElementById("console");
    if (hidConsole) {
        let recvLine = "";
        hidConsole.insertAdjacentText("beforeend", recvLine);
        recvLine = "";

        const autoScrollCheckbox = document.getElementById("autoscroll") as HTMLInputElement;
        if (autoScrollCheckbox && autoScrollCheckbox.checked) {
            hidConsole.scrollTop = hidConsole.scrollHeight;
        }

        if (hidConsole.innerHTML.length > 1000000) { // example console length
            hidConsole.innerHTML = hidConsole.innerHTML.slice(-1000000);
        }
    }
}

function dataReceiveHandler(msg: Uint8Array) {
    const text = new TextDecoder().decode(msg);
    let recvLine = text;

    // Assuming each message is separated by a newline
    const lines = text.split('|').map(line => line.trim()).filter(line => line);
    lines.forEach(line => {
        const parts = line.match(/\((\d+),(\d+)\) Rescale: (\d+)/);
        if (parts) {
            const [, row, col, rescale] = parts.map(Number);
            document.dispatchEvent(new CustomEvent('hid-data', {
                detail: { row, col, rescale }
            }));
        }
    });
}