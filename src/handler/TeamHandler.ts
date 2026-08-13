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
					case "nameLeft": {
						const name = newValue || "";
						element.innerText = name;

						const avatar = document.querySelector<HTMLDivElement>("#avatarLeft");
						if (!avatar) break;

						avatar.style.backgroundImage = `url(https://api.try-z.net/a/${encodeURIComponent(name)})`;
						break;
					}
					case "nameRight": {
						const name = newValue || "";
						element.innerText = name;

						const avatar = document.querySelector<HTMLDivElement>("#avatarRight");
						if (!avatar) break;

						avatar.style.backgroundImage = `url(https://api.try-z.net/a/${encodeURIComponent(name)})`;
						break;
					}
					case "starLeft":
					case "starRight": {
						if (value.key === "tourney.manager.bestOF") {
							this.createStars(
								element,
								data.tourney.manager.stars[
									value.id === "starLeft" ? "left" : "right"
								] || 0,
								newValue || 3,
								value.id === "starLeft" ? "left" : "right",
							);
							break;
						}

						this.createStars(
							element,
							newValue || 0,
							data.tourney.manager.bestOF || 3,
							value.id === "starLeft" ? "left" : "right",
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

	createStars(
		element: HTMLElement,
		number: number,
		bestOF: number,
		side: "left" | "right" = "left",
	) {
		const maxStars = Math.floor((bestOF + 1) / 2);
		const stars = [...Array(maxStars)].map((_, idx: number) =>
			this.createStar(side, idx < number, idx === number - 1),
		);

		element.innerHTML = "";
		element.append(...stars);
	}

	createStar(
		side: "left" | "right" = "left",
		isMarked: boolean,
		isLastMarked = false,
	) {
		const star = document.createElement("div");
		star.className = "size-10 rounded-full border-2";
		star.classList.add(
			side === "left" ? "border-custom-side-left" : "border-custom-side-right",
		);
		if (isMarked) {
			star.classList.add(
				isLastMarked ? "w-15" : "aspect-square",
				side === "left" ? "bg-custom-side-left" : "bg-custom-side-right",
			);
		}

		return star;
	}
}
