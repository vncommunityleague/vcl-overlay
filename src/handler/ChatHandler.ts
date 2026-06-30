import type ZEngine from "@fukutotojido/z-engine";
import type Test from "../Test";

interface Chat {
	team: string;
	time: string;
	name: string;
	messageBody: string;
}

export default class ChatHandler {
	static map = [
		{
			id: "chatInner",
			key: "tourney.manager.chat.length",
		},
	];

	constructor(engine: ZEngine, test?: Test) {
		for (const value of ChatHandler.map) {
			const element: HTMLElement | null = document.querySelector(
				`#${value.id}`,
			);

			engine.register(value.key, (_, __, data) => {
				if (element === null || test?.testMode) return;

				switch (value.id) {
					case "chatInner": {
						const chats: Chat[] = data.tourney.manager.chat;
						this.createChats(element, chats);
						break;
					}
					default: {
						break;
					}
				}
			});
		}
	}

	createChats(element: HTMLElement, chats: Chat[]) {
		element.innerHTML = "";

		const elements = chats.map(this.createChat);
		element.append(...elements);
		element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
	}

	createChat({
		team,
		time,
		name,
		messageBody,
	}: {
		team: string;
		time: string;
		name: string;
		messageBody: string;
	}) {
		const teamColor = {
			bot: "custom-side-bot",
			left: "custom-side-left",
			right: "custom-side-right",
		};
		const element = document.createElement("div");
		element.className = "w-full flex items-start gap-5";

		const timeElement = document.createElement("div");
		timeElement.className = "w-[50px] text-right";
		timeElement.innerText = time;

		const nameElement = document.createElement("div");
		nameElement.className = "w-[120px] font-bold";
		if (teamColor[team as keyof typeof teamColor]) {
			nameElement.classList.add(
				`text-${teamColor[team as keyof typeof teamColor]}`,
			);
		}
		nameElement.innerText = name;

		const messageElement = document.createElement("div");
		messageElement.className = "flex-1";
		messageElement.innerText = messageBody;

		element.append(timeElement, nameElement, messageElement);
		return element;
	}
}
