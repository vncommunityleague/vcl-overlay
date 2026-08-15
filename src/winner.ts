import ZEngine from "@fukutotojido/z-engine";
import RoundHandler from "./handler/RoundHandler";
import WinnerHandler from "./handler/WinnerHandler";

const engine = new ZEngine("ws://127.0.0.1:24050/ws");

new WinnerHandler(engine);
new RoundHandler();
