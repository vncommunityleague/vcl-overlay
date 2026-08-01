import ZEngine from "@fukutotojido/z-engine";
import BeatmapHandler from "./handler/BeatmapHandler";
import MappoolHandler from "./handler/MappoolHandler";

const engine = new ZEngine("ws://127.0.0.1:24050/ws");

const beatmapHandler = new BeatmapHandler(engine);
const mappoolHandler = new MappoolHandler();

await mappoolHandler.init(beatmapHandler);
beatmapHandler.set(mappoolHandler);
