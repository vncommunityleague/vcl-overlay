import type ZEngine from "@fukutotojido/z-engine";
import type Test from "../Test";

export default class GameStateHandler {
	chatElement: HTMLElement | null;
	scoreContainerElement: HTMLElement | null;
	topBarElement: HTMLElement | null;
	starLeftElement: HTMLElement | null;
	starRightElement: HTMLElement | null;

	constructor(engine: ZEngine, test?: Test) {
		this.chatElement = document.querySelector("#chat");
		this.scoreContainerElement = document.querySelector("#scoreContainer");
		this.topBarElement = document.querySelector("#topBar");

		this.starLeftElement = document.querySelector("#starLeft");
		this.starRightElement = document.querySelector("#starRight");

		engine.register("tourney.manager.bools.scoreVisible", (_, newValue) => {
			if (test?.testMode) return;
			this.updateScoreVisible(newValue);
		});

		engine.register("tourney.manager.bools.starsVisible", (_, newValue) => {
			if (test?.testMode) return;
			this.updateStarsVisible(newValue);
		});
	}

	updateScoreVisible(scoreVisible: boolean) {
		if (!this.chatElement || !this.scoreContainerElement || !this.topBarElement)
			return;

		if (scoreVisible) {
			this.chatElement.style.opacity = "0";
			this.scoreContainerElement.style.opacity = "1";
			this.topBarElement.style.bottom = "32px";
			return;
		}

		this.chatElement.style.opacity = "";
		this.scoreContainerElement.style.opacity = "";
		this.topBarElement.style.bottom = "200px";
	}

	updateStarsVisible(starsVisible: boolean) {
		if (!this.starLeftElement || !this.starRightElement) return;

		this.starLeftElement.style.display = starsVisible ? "" : "none";
		this.starRightElement.style.display = starsVisible ? "" : "none";
	}
}
