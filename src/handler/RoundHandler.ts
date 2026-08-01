export default class RoundHandler {
	roundElement: HTMLElement | null;
	
	constructor() {
		this.roundElement = document.querySelector<HTMLDivElement>("#roundName");

		const url = new URL(window.location.href);
		const roundName = url.searchParams.get("round") || "ROUND OF 32";

		if (!this.roundElement) return;
		this.roundElement.innerText = roundName;
	}
}