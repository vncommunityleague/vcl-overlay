import axios from "axios";
import type { Beatmap, Data, Modpool } from "../types";
import type BeatmapHandler from "./BeatmapHandler";
import { PickAction } from "./BeatmapHandler";

enum Status {
	NIL = 0,
	PICKED = 1,
	BANNED = 2,
	PROTECTED = 3
}

enum Side {
	NIL = 0,
	LEFT = 1,
	RIGHT = 2,
}

class BeatmapContainer {
	beatmapHandler: BeatmapHandler;
	data: Beatmap;
	status = Status.NIL;
	side = Side.NIL;
	ele: HTMLDivElement;

	constructor(data: Beatmap, icon: string, beatmapHandler: BeatmapHandler) {
		this.beatmapHandler = beatmapHandler;
		this.data = data;

		const ele = document.createElement("div");
		ele.classList.add("w-[500px]", "h-[60px]", "flex", "rounded-xl", "overflow-hidden", "border-spacing-custom-border", "border-surface-0", "select-none");
		this.ele = ele;

		this.ele.innerHTML = `
		<div 
			class="flex justify-center w-[0px] bg-white text-[10px] font-medium leading-none text-center align-center overflow-hidden transition-all indicator"
		></div>
		<div 
			class="relative flex-1 h-full bg-white flex justify-between items-center gap-5 p-2.5 px-5 text-white overflow-hidden"
		>
			<img src="${data.beatmapset.covers.slimcover}" class="absolute top-0 left-0 w-full h-full object-cover object-center"/>
			<div class="absolute top-0 left-0 w-full h-full bg-crust/70"></div>
			<div class="relative truncate shrink-0 flex-1">
				<div class="text-xs truncate">${data.beatmapset.artist}</div>
				<div class="font-medium truncate text-md">${data.beatmapset.title}</div>
			</div>
			<div class="relative truncate text-xs flex flex-col shrink-0 flex-1">
				<div class="w-full text-right overflow-hidden flex justify-end">[<span class="font-medium truncate">${data.version}</span>]</div> 
				<div class="truncate w-full text-right">by <span class="font-medium">${data.owners.map((owner) => owner.username).join(", ")}</span></div>
			</div>
			<img src="${icon}" class="relative w-[40px] object-contain object-center" />
			<div class="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 transition-all overlay"></div>
		</div>
		`;

		this.ele.addEventListener("click", (event: MouseEvent) =>
			this.handleClick(event),
		);
		this.ele.addEventListener("contextmenu", (event: MouseEvent) =>
			this.handleClick(event),
		);
	}

	handleClick(event: MouseEvent) {
		event.preventDefault();
		const { shiftKey, ctrlKey, altKey, type } = event;

		switch (type) {
			case "click": {
				if (shiftKey) {
					this.side = Side.LEFT;
					this.status = Status.BANNED;
					this.updateStatus();
					return;
				}

				if (ctrlKey) {
					this.side = Side.NIL;
					this.status = Status.NIL;
					this.updateStatus();
					return;
				}
				
				if (altKey) {
					this.side = Side.LEFT;
					this.status = Status.PROTECTED;
					this.updateStatus();
					return;
				}

				this.side = Side.LEFT;
				this.status = Status.PICKED;
				this.updateStatus();
				break;
			}
			case "contextmenu": {
				if (shiftKey) {
					this.side = Side.RIGHT;
					this.status = Status.BANNED;
					this.updateStatus();
					return;
				}

				if (ctrlKey) {
					this.side = Side.NIL;
					this.status = Status.NIL;
					this.updateStatus();
					return;
				}

				if (altKey) {
					this.side = Side.RIGHT;
					this.status = Status.PROTECTED;
					this.updateStatus();
					return;
				}

				this.side = Side.RIGHT;
				this.status = Status.PICKED;
				this.updateStatus();
				break;
			}
		}
	}

	updateStatus() {
		const indicator: HTMLDivElement | null =
			this.ele.querySelector(".indicator");
		const overlay: HTMLDivElement | null = this.ele.querySelector(".overlay");

		if (indicator) {
			switch (this.status) {
				case Status.PICKED: {
					indicator.innerHTML = `<span style="writing-mode: vertical-lr; text-orientation: upright;">PICK</span>`;
					indicator.style.width = "20px";
					indicator.style.color = "white";

					switch (this.side) {
						case Side.LEFT: {
							this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.PICK_RED);
							indicator.style.backgroundColor = "var(--color-custom-side-left)";
							break;
						}
						case Side.RIGHT: {
							this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.PICK_BLUE);
							indicator.style.backgroundColor = "var(--color-custom-side-right)";
							break;
						}
						default: {
							indicator.style.backgroundColor = "white";
						}
					}
					break;
				}
				case Status.BANNED: {
					indicator.innerHTML = `<span style="writing-mode: vertical-lr; text-orientation: upright;">BAN</span>`;
					indicator.style.width = "20px";
					indicator.style.backgroundColor = "var(--color-custom-ban-badge)";

					switch (this.side) {
						case Side.LEFT: {
							this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.REMOVE_PICK);
							indicator.style.color = "var(--color-custom-side-left)";
							break;
						}
						case Side.RIGHT: {
							this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.REMOVE_PICK);
							indicator.style.color = "var(--color-custom-side-right)";
							break;
						}
						default: {
							indicator.style.color = "";
						}
					}
					break;
				}
				case Status.PROTECTED: {
					indicator.innerHTML = `<span style="writing-mode: vertical-lr; text-orientation: upright;">PROT</span>`;
					indicator.style.width = "20px";
					indicator.style.backgroundColor = "var(--color-custom-protect-badge)";
					indicator.style.color = "var(--color-custom-protect-badge-text)";

					switch (this.side) {
						case Side.LEFT: {
							this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.REMOVE_PICK);
							break;
						}
						case Side.RIGHT: {
							this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.REMOVE_PICK);
							break;
						}
					}
					break;
				}
				default: {
					this.beatmapHandler.updatePickedMaps(this.data.id, PickAction.REMOVE_PICK);
					indicator.textContent = "";
					indicator.style.width = "0px";
					indicator.style.color = "";
				}
			}
		}

		if (overlay) {
			switch (this.status) {
				case Status.BANNED: {
					overlay.style.opacity = "100%";
					break;
				}
				default: {
					overlay.style.opacity = "";
				}
			}
		}
	}
}

class ModContainer {
	mod: string;
	icon: string;
	beatmaps: BeatmapContainer[] = [];
	ele: HTMLDivElement;

	constructor({ maps, mod, icon }: Modpool, mapsData: Beatmap[], beatmapHandler: BeatmapHandler) {
		this.mod = mod;
		this.icon = icon;

		const ele = document.createElement("div");
		ele.classList.add("w-full", "flex", "flex-wrap", "gap-5", "justify-center");
		this.ele = ele;

		for (const id of maps) {
			const mapData = mapsData.find((map) => map.id === id);
			if (!mapData) continue;

			const beatmapContainer = new BeatmapContainer(mapData, this.icon, beatmapHandler);
			this.ele.append(beatmapContainer.ele);
			this.beatmaps.push(beatmapContainer);
		}
	}
}

export default class MappoolHandler {
	beatmaps: Beatmap[] = [];
	mods: ModContainer[] = [];
	showMappool = false;

	constructor(beatmapHandler: BeatmapHandler) {
		this.init(beatmapHandler);
		document
			.querySelector("#toggleMappool")
			?.addEventListener("click", () => this.toggleMappool());
	}

	toggleMappool() {
		this.showMappool = !this.showMappool;

		const mappoolContainer =
			document.querySelector<HTMLDivElement>("#mappoolContainer");
		const background = document.querySelector<HTMLDivElement>("#background");
		
		if (!mappoolContainer || !background) return;

		if (this.showMappool) {
			mappoolContainer.style.clipPath =
				"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

			background.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100px, 100% 100px, 100% 820px, 100% 820px, 100% 100%, 0% 100%)";
		}

		if (!this.showMappool) {
			mappoolContainer.style.clipPath =
				"polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
			background.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100px, 0% 100px, 0% 820px, 100% 820px, 100% 100%, 0% 100%)";
		}
	}

	async init(beatmapHandler: BeatmapHandler) {
		try {
			const json: Data = (await axios.get("./data.json")).data;
			const mapIds: number[] = json.mappool.reduce((acc, currMod) => {
				acc.push(...currMod.maps);
				return acc;
			}, [] as number[]);

			const query = new URLSearchParams();
			for (const id of mapIds) {
				query.append("ids", id.toString());
			}

			const {
				data: { beatmaps },
			} = await axios.get(`https://api.try-z.net/beatmaps?${query.toString()}`);
			this.beatmaps = beatmaps;

			const mappoolContainer = document.querySelector("#mappoolContainer");
			for (const mod of json.mappool) {
				const modContainer = new ModContainer(mod, this.beatmaps, beatmapHandler);
				if (mappoolContainer) mappoolContainer.append(modContainer.ele);
				this.mods.push(modContainer);
			}
		} catch (e) {
			console.error((e as Error).message);
		}
	}
}
