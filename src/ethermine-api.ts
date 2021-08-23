import fetch from "node-fetch";

export class EthermineAPI {
	private _wallet: string;

	public constructor(wallet: string) {
		this._wallet = wallet;
	}

	showWallet(): string {
		return this._wallet;
	}

	async currentStats(): Promise<any> {
		const response = await this.getData("currentStats");
		if (response["status"] !== "OK") {
			return {};
		}
		return response;
	}

	async dashboard(): Promise<any> {
		const response = await this.getData("dashboard");
		if (response["status"] !== "OK") {
			return {};
		}
		return response;
	}

	async history(): Promise<any> {
		const response = await this.getData("history");
		if (response["status"] !== "OK") {
			return {};
		}
		return response;
	}

	async payouts(): Promise<any> {
		const response = await this.getData("payouts");
		if (response["status"] !== "OK") {
			return {};
		}
		return response;
	}

	async rounds(): Promise<any> {
		const response = await this.getData("rounds");
		if (response["status"] !== "OK") {
			return {};
		}
		return response;
	}

	async settings(): Promise<any> {
		const response = await this.getData("settings");
		if (response["status"] !== "OK") {
			return {};
		}
		return response;
	}

	async getData(request: RequestInfo): Promise<any> {
		const response = await fetch(`https://api.ethermine.org/miner/${this._wallet}/${request}`);
		const body = await response.json();
		return body;
	}
}