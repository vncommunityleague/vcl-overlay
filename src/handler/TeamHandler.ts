import type ZEngine from "@fukutotojido/z-engine";
import type Test from "../Test";

export default class TeamHandler {
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
		{
			id: "starLeft",
			key: "tourney.manager.bestOF",
		},
		{
			id: "starRight",
			key: "tourney.manager.bestOF",
		},
	];

	constructor(engine: ZEngine, _?: Test) {
		for (const value of TeamHandler.map) {
			const element: HTMLElement | null = document.querySelector(
				`#${value.id}`,
			);

			engine.register(value.key, (_, newValue, data) => {
				if (element === null) return;

				switch (value.id) {
					case "nameLeft":
					case "nameRight": {
						element.innerText = newValue || "Placeholder";
						break;
					}
					case "starLeft":
					case "starRight": {
						if (value.key === "tourney.manager.bestOF") {
							this.createStars(
								element,
								data.tourney.manager.stars[
									value.id === "starLeft" ? "left" : "right"
								] ?? 0,
								newValue ?? 3,
							);
							break;
						}

						this.createStars(
							element,
							newValue ?? 0,
							data.tourney.manager.bestOF ?? 3,
						);

						break;
					}
					default: {
						break;
					}
				}
			});
		}
	}

	createStars(element: HTMLElement, number: number, bestOF: number) {
		const maxStars = Math.floor((bestOF + 1) / 2);
		const stars = [...Array(maxStars)].map((_, idx: number) =>
			this.createStar(idx < number),
		);

		element.innerHTML = "";
		element.append(...stars);
	}

	createStar(isMarked: boolean) {
		const star = document.createElement("div");
		star.className = "w-[40px] h-[15px] rounded-full border-1 border-custom-star-border";
		if (isMarked) star.classList.add("bg-custom-star-fill");

		return star;
	}
}
