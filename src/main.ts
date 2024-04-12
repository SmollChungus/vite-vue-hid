// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { WebRawHID } from "./components/webRawHID.ts";
import { WebUsbComInterface } from "./components/webUsbComInterface.ts";

let com: WebUsbComInterface;

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
                    connectButton.innerText = "Disconnect";
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

document.addEventListener('DOMContentLoaded', () => {
    generateRandomBlobbyGradient();
    setupPCBConnection();
    const app = createApp(App);
    app.mount('#app');
});
