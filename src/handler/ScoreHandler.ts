import type ZEngine from "@fukutotojido/z-engine";
import type { Data } from "@fukutotojido/z-engine";
import { CountUp, type CountUpOptions } from "countup.js";
import type Test from "../Test";
import IPCClient from "./IPCClient";

export enum ScoringCondition {
	SCORE = "score",
	ACCURACY = "acc",
	MAX_COMBO = "combo",
	MISS_COUNT = "miss",
}

export default class ScoreHandler {
	scoreLeftElement: HTMLElement | null;
	scoreRightElement: HTMLElement | null;
	differenceElement: HTMLElement | null;
	barLeftElement: HTMLElement | null;
	barLeftContainerElement: HTMLElement | null;
	barRightElement: HTMLElement | null;
	barRightContainerElement: HTMLElement | null;
	countUpLeft: CountUp;
	countUpRight: CountUp;
	countUpDiff: CountUp;
	maxObjects = 0;

	scores = {
		left: 0,
		right: 0,
	};

	accs = {
		left: 1,
		right: 1,
	};

	ur = {
		left: 1,
		right: 1,
	};

	maxCombos = {
		left: 0,
		right: 0,
	};

	clients: IPCClient[] = [];
	engine: ZEngine;
	test?: Test;

	scoringCondition = ScoringCondition.SCORE;

	COUNT_UP_BASE_OPTIONS: CountUpOptions = {
		duration: 0.5,
		useEasing: false,
		onCompleteCallback: () => this.onComplete(),
	};

	COUNT_UP_ACC_OPTIONS: CountUpOptions = {
		...this.COUNT_UP_BASE_OPTIONS,
		decimalPlaces: 2,
		suffix: "%",
	};

	COUNT_UP_X_OPTIONS: CountUpOptions = {
		...this.COUNT_UP_BASE_OPTIONS,
		suffix: "x",
	};

	constructor(engine: ZEngine, test?: Test) {
		this.engine = engine;
		this.test = test;

		this.scoreLeftElement = document.querySelector("#scoreLeft");
		this.scoreRightElement = document.querySelector("#scoreRight");
		this.differenceElement = document.querySelector("#difference");

		this.barLeftContainerElement = document.querySelector("#containerLeft");
		this.barLeftElement = document.querySelector("#barLeft");
		this.barRightContainerElement = document.querySelector("#containerRight");
		this.barRightElement = document.querySelector("#barRight");

		this.countUpLeft = new CountUp(
			this.scoreLeftElement ?? "#scoreLeft",
			0,
			this.COUNT_UP_BASE_OPTIONS,
		);
		this.countUpRight = new CountUp(
			this.scoreRightElement ?? "#scoreRight",
			0,
			this.COUNT_UP_BASE_OPTIONS,
		);
		this.countUpDiff = new CountUp(this.differenceElement ?? "#difference", 0, {
			...this.COUNT_UP_BASE_OPTIONS,
			prefix: "+",
		});
		this.countUpLeft.start();
		this.countUpRight.start();
		this.countUpDiff.start();

		for (const ele of document.querySelectorAll<HTMLInputElement>(
			"[name=scoring]",
		)) {
			const instance = this;
			ele.addEventListener("change", function () {
				instance.switchScoringCondition(this.value as ScoringCondition);
			});
		}

		engine.register("tourney.manager.gameplay.score.left", (_, __, data) =>
			this.update(data),
		);
		engine.register("tourney.manager.gameplay.score.right", (_, __, data) =>
			this.update(data),
		);
		engine.register("tourney.ipcClients.length", (_, newValue) =>
			this.updateIPCClients(newValue),
		);

		engine.register_jq(
			".menu?.bm?.stats?.circles + .menu?.bm?.stats?.sliders",
			(_, newValue) => {
				this.maxObjects = newValue;
			},
		);
	}

	update(data: Data) {
		if (this.test?.testMode) {
			this.test.testAll();
			return;
		}

		switch (this.scoringCondition) {
			case ScoringCondition.SCORE: {
				this.updateScoring(
					data.tourney.manager.gameplay.score.left,
					data.tourney.manager.gameplay.score.right,
				);
				break;
			}
			case ScoringCondition.ACCURACY: {
				const accuracyLeft = this.clients
					.filter((client) => client.team === "left")
					.reduce((acc, curr, _, arr) => acc + curr.accuracy / arr.length, 0);
				const accuracyRight = this.clients
					.filter((client) => client.team === "right")
					.reduce((acc, curr, _, arr) => acc + curr.accuracy / arr.length, 0);

				this.updateScoring(accuracyLeft, accuracyRight);
				break;
			}
			case ScoringCondition.MAX_COMBO: {
				const maxComboLeft = Math.max(
					...this.clients
						.filter((client) => client.team === "left")
						.map((client) => client.maxCombo),
				);
				const maxComboRight = Math.max(
					...this.clients
						.filter((client) => client.team === "right")
						.map((client) => client.maxCombo),
				);
				this.updateScoring(maxComboLeft, maxComboRight);
				break;
			}
			case ScoringCondition.MISS_COUNT: {
				const missCountLeft = this.clients
					.filter((client) => client.team === "left")
					.reduce((acc, curr) => acc + curr.h0, 0);
				const missCountRight = this.clients
					.filter((client) => client.team === "right")
					.reduce((acc, curr) => acc + curr.h0, 0);
				this.updateScoring(missCountLeft, missCountRight);
			}
		}
	}

	updateIPCClients(numClients: number) {
		for (const client of this.clients) {
			client.destruct();
		}

		this.clients = [...Array(numClients)].map((_, idx) => {
			return new IPCClient(this.engine, idx);
		});
	}

	onComplete() {
		if (
			!this.barLeftContainerElement ||
			!this.barRightContainerElement ||
			!this.scoreLeftElement ||
			!this.scoreRightElement
		)
			return;

		this.barLeftContainerElement.style.minWidth = `calc(${
			getComputedStyle(this.scoreLeftElement).width
		} / 2)`;
		this.barRightContainerElement.style.minWidth = `calc(${
			getComputedStyle(this.scoreRightElement).width
		} / 2)`;
	}

	getLineDiffFactor(difference: number, left: number, right: number) {
		switch (this.scoringCondition) {
			case ScoringCondition.SCORE: {
				return Math.min(0.4, (Math.abs(difference) / 1500000) ** 0.5 / 2);
			}
			case ScoringCondition.ACCURACY: {
				return Math.min(0.4, (Math.abs(difference) / 1) ** 0.5 / 2);
			}
			case ScoringCondition.MAX_COMBO: {
				return Math.min(
					0.4,
					(Math.abs(difference) /
						Math.max(1, this.engine.cache.menu.bm.stats.maxCombo)) **
						0.5 /
						2,
				);
			}
			case ScoringCondition.MISS_COUNT: {
				return Math.min(0.6, Math.abs(difference) / (left + right));
			}
		}
	}

	updateScoring(scoringLeft: number, scoringRight: number) {
		const difference = scoringLeft - scoringRight;
		const lineDiffFactor = this.getLineDiffFactor(
			difference,
			scoringLeft,
			scoringRight,
		);

		if (
			!this.barLeftElement ||
			!this.barLeftContainerElement ||
			!this.barRightElement ||
			!this.barRightContainerElement ||
			!this.scoreLeftElement ||
			!this.scoreRightElement
		)
			return;

		this.countUpLeft.update(scoringLeft);
		this.countUpRight.update(scoringRight);
		this.countUpDiff.update(Math.abs(difference));

		const isLeftLeading =
			difference > 0 ===
			(this.scoringCondition !== ScoringCondition.MISS_COUNT);
		const isRightLeading =
			difference < 0 ===
			(this.scoringCondition !== ScoringCondition.MISS_COUNT);

		this.barLeftContainerElement.style.flex = "1";
		this.barRightContainerElement.style.flex = "1";

		if (isLeftLeading) {
			this.barLeftContainerElement.style.flex = `${(50 + 50 * lineDiffFactor) / (50 - 50 * lineDiffFactor)}`;
			this.barRightContainerElement.style.flex = "1";

			this.scoreLeftElement.classList.add("text-7xl", "font-bold");
			this.scoreLeftElement.classList.remove("text-4xl");

			this.scoreRightElement.classList.add("text-4xl");
			this.scoreRightElement.classList.remove("text-7xl", "font-bold");
		}

		if (isRightLeading) {
			this.barRightContainerElement.style.flex = `${(50 + 50 * lineDiffFactor) / (50 - 50 * lineDiffFactor)}`;
			this.barLeftContainerElement.style.flex = "1";

			this.scoreLeftElement.classList.add("text-4xl");
			this.scoreLeftElement.classList.remove("text-7xl", "font-bold");

			this.scoreRightElement.classList.add("text-7xl", "font-bold");
			this.scoreRightElement.classList.remove("text-4xl");
		}
	}

	switchScoringCondition(type: ScoringCondition) {
		let countUpOptions = this.COUNT_UP_BASE_OPTIONS;
		switch (type) {
			case ScoringCondition.SCORE: {
				countUpOptions = this.COUNT_UP_BASE_OPTIONS;
				break;
			}
			case ScoringCondition.ACCURACY: {
				countUpOptions = this.COUNT_UP_ACC_OPTIONS;
				break;
			}
			case ScoringCondition.MAX_COMBO: {
				countUpOptions = this.COUNT_UP_X_OPTIONS;
				break;
			}
			case ScoringCondition.MISS_COUNT: {
				countUpOptions = this.COUNT_UP_X_OPTIONS;
				break;
			}
		}

		this.countUpLeft?.pauseResume();
		this.countUpRight?.pauseResume();
		this.countUpDiff?.pauseResume();

		this.countUpLeft = new CountUp(
			this.scoreLeftElement ?? "#scoreLeft",
			0,
			countUpOptions,
		);
		this.countUpRight = new CountUp(
			this.scoreRightElement ?? "#scoreRight",
			0,
			countUpOptions,
		);
		this.countUpDiff = new CountUp(this.differenceElement ?? "#difference", 0, {
			...countUpOptions,
			prefix: "+",
		});
		this.countUpLeft.start();
		this.countUpRight.start();
		this.countUpDiff.start();

		this.scoringCondition = type;
		this.update(this.engine.cache);
	}
}
