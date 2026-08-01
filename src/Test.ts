import type ZEngine from "@fukutotojido/z-engine";
import type BeatmapHandler from "./handler/BeatmapHandler";
import type ChatHandler from "./handler/ChatHandler";
import type GameStateHandler from "./handler/GameStateHandler";
import type ScoreHandler from "./handler/ScoreHandler";
import type TeamHandler from "./handler/TeamHandler";

export default class Test {
	engine: ZEngine;

	testMode = false;
	beatmapHandler?: BeatmapHandler;
	chatHandler?: ChatHandler;
	teamHandler?: TeamHandler;
	scoreHandler?: ScoreHandler;
	gameStateHandler?: GameStateHandler;

	constructor(engine: ZEngine) {
		this.engine = engine;

		const instance = this;

		(document.querySelector("#testMode") as HTMLInputElement).onclick =
			function () {
				instance.testMode = (this as HTMLInputElement).checked;
				instance.testAll();
			};

		(document.querySelector("#testScoreVisible") as HTMLInputElement).onclick =
			() => this.testScoreVisible();

		(document.querySelector("#testStarsVisible") as HTMLInputElement).onclick =
			() => this.testStarsVisible();

		(document.querySelector("#testScoreLeft") as HTMLInputElement).onblur =
			() => this.testScore();
		(document.querySelector("#testScoreLeft") as HTMLInputElement).onchange =
			() => this.testScore();

		(document.querySelector("#testScoreRight") as HTMLInputElement).onblur =
			() => this.testScore();
		(document.querySelector("#testScoreRight") as HTMLInputElement).onchange =
			() => this.testScore();
	}

	assign({
		beatmapHandler,
		chatHandler,
		teamHandler,
		scoreHandler,
		gameStateHandler,
	}: {
		beatmapHandler?: BeatmapHandler;
		chatHandler?: ChatHandler;
		teamHandler?: TeamHandler;
		scoreHandler?: ScoreHandler;
		gameStateHandler?: GameStateHandler;
	}) {
		this.beatmapHandler = beatmapHandler;
		this.chatHandler = chatHandler;
		this.teamHandler = teamHandler;
		this.scoreHandler = scoreHandler;
		this.gameStateHandler = gameStateHandler;
	}

	testAll() {
		if (!this.testMode) {
			this.scoreHandler?.updateScoring(
				this.engine.cache?.tourney.manager.gameplay.score.left ?? 0,
				this.engine.cache?.tourney.manager.gameplay.score.right ?? 0,
			);
			this.gameStateHandler?.updateScoreVisible(
				this.engine.cache.tourney.manager.bools.scoreVisible,
			);
			this.gameStateHandler?.updateStarsVisible(
				this.engine.cache.tourney.manager.bools.starsVisible,
			);
			return;
		}

		this.testScore();
		this.testScoreVisible();
		this.testStarsVisible();
	}

	testScore() {
		if (!this.testMode) return;

		const scoreLeft = Number(
			(document.querySelector("#testScoreLeft") as HTMLInputElement).value,
		);
		const scoreRight = Number(
			(document.querySelector("#testScoreRight") as HTMLInputElement).value,
		);

		this.scoreHandler?.updateScoring(scoreLeft, scoreRight);
	}

	testScoreVisible() {
		if (!this.testMode) return;
		this.gameStateHandler?.updateScoreVisible(
			document.querySelector<HTMLInputElement>("#testScoreVisible")?.checked ??
				false,
		);
	}

	testStarsVisible() {
		if (!this.testMode) return;
		this.gameStateHandler?.updateStarsVisible(
			document.querySelector<HTMLInputElement>("#testStarsVisible")?.checked ??
				false,
		);
	}
}
