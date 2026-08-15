import type ZEngine from "@fukutotojido/z-engine";
import type Test from "../Test";

export default class WinnerHandler {
	static map = [
		{
			id: "nameLeft",
			key: "tourney.manager.teamName.left",
		},
		{
			id: "nameRight",
			key: "tourney.manager.teamName.right",
		},
		{
			id: "starLeft",
			key: "tourney.manager.stars.left",
		},
		{
			id: "starRight",
			key: "tourney.manager.stars.right",
		},
	];

	nameLeft: string = "";
	nameRight: string = "";
	starLeft: number = 0;
	starRight: number = 0;

	constructor(engine: ZEngine, _?: Test) {
		for (const value of WinnerHandler.map) {
			engine.register(value.key, (_, newValue) => {
				switch (value.id) {
					case "nameLeft": {
						this.nameLeft = newValue;
						break;
					}
					case "nameRight": {
						this.nameRight = newValue;
						break;
					}
					case "starLeft": {
						this.starLeft = newValue;
						break;
					}
					case "starRight": {
						this.starRight = newValue;
						break;
					}
					default: {
						break;
					}
				}

				this.updateWinner();
			});
		}
	}

	updateWinner() {
		let name = "";

		if (this.starLeft > this.starRight) name = this.nameLeft;
		if (this.starRight > this.starLeft) name = this.nameRight;

		const avatar = document.querySelector<HTMLDivElement>("#avatar");
		if (!avatar) return;

		const playerName = document.querySelector<HTMLDivElement>("#name");
		if (!playerName) return;

		if (!name) {
			avatar.style.backgroundImage = ``;
			playerName.innerText = "";

			return;
		}

		avatar.style.backgroundImage = `url(https://api.try-z.net/a/${encodeURIComponent(name)})`;
		playerName.innerText = name;
	}
}
