import ZEngine from "@fukutotojido/z-engine";
import BeatmapHandler from "./handler/BeatmapHandler";
import ChatHandler from "./handler/ChatHandler";
import GameStateHandler from "./handler/GameStateHandler";
import MappoolHandler from "./handler/MappoolHandler";
import ScoreHandler from "./handler/ScoreHandler";
import TeamHandler from "./handler/TeamHandler";
import Test from "./Test";

const engine = new ZEngine("ws://127.0.0.1:24050/ws");
const test = new Test(engine);

const beatmapHandler = new BeatmapHandler(engine, test);
const chatHandler = new ChatHandler(engine, test);
const teamHandler = new TeamHandler(engine, test);
const scoreHandler = new ScoreHandler(engine, test);
const gameStateHandler = new GameStateHandler(engine, test);
new MappoolHandler(beatmapHandler);

test.assign({
	beatmapHandler,
	chatHandler,
	teamHandler,
	scoreHandler,
    gameStateHandler
});
