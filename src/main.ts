/*
 * Created with @iobroker/create-adapter v1.31.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";

import { EthermineAPI } from "./ethermine-api";

// Load your modules here, e.g.:
// import * as fs from "fs";

class Ethermine extends utils.Adapter {

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "ethermine",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("config wallets: " + JSON.stringify(this.config.wallets));

		if (this.config.wallets !== undefined && this.config.wallets.length > 0) {
			this.startFetching(this.config.wallets);
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
	// private onMessage(obj: ioBroker.Message): void {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

	startFetching(wallets: [Wallet]): void {
		for (const wallet of wallets) {
			this.requestEthermineData(wallet);
		}

		setTimeout(() => {
			this.startFetching(wallets);
		}, 10 * 60 * 1000);
	}

	async requestEthermineData(wallet: Wallet): Promise<void> {
		if (wallet.enabled === true) {
			this.log.info(`Fetching data for ${wallet.name}!`);
			const api = new EthermineAPI(wallet.address);

			if (this.config.currentStats === true) {
				this.log.info("Processing currentStats");
				const currentStats = await api.currentStats();
				this.log.info("Current Stats: " + JSON.stringify(currentStats));
				this.processData(currentStats, wallet.name + "." + wallet.address + "." + "currentStats");
			}

			if (this.config.dashboard === true) {
				this.log.info("Processing dashboard");
				const dashboard = await api.dashboard();
				this.processData(dashboard, wallet.name + "." + wallet.address + "." + "dashboard");
			}

			if (this.config.history === true) {
				this.log.info("Processing history");
				const history = await api.history();
				this.processData(history, wallet.name + "." + wallet.address + "." + "history");
			}

			if (this.config.payouts === true) {
				this.log.info("Processing payouts");
				const payouts = await api.payouts();
				this.processData(payouts, wallet.name + "." + wallet.address + "." + "payouts");
			}

			if (this.config.rounds === true) {
				this.log.info("Processing rounds");
				const rounds = await api.rounds();
				this.processData(rounds, wallet.name + "." + wallet.address + "." + "rounds");
			}

			if (this.config.settings === true) {
				this.log.info("Processing settings");
				const settings = await api.settings();
				this.processData(settings, wallet.name + "." + wallet.address + "." + "settings");
			}
		} else {
			this.log.info(`${wallet.name} is not enabled!`);
		}
	}

	processData(data: any, path: string): void {
		for (const key in data) {
			if (data.hasOwnProperty(key) && data[key] !== null) {
				let newPath = path + ".";
				let tmpKey = key;

				if (Array.isArray(data)) {
					const arrayLength = `${data.length}`.length;

					while (tmpKey.length < arrayLength) {
						tmpKey = "0" + tmpKey;
					}
				}

				newPath = newPath + tmpKey

				if (typeof data[key] === "object") {
					this.log.info("Processing object " + newPath + ": " + JSON.stringify(data[key]));

					this.setObjectNotExistsAsync(newPath, {
						type: "folder",
						common: {
							name: key,
							type: "object",
							role: "indicator",
							read: true,
							write: true,
						},
						native: {},
					});

					this.processData(data[key], newPath);
				} else {
					// this.log.info(key + ": " + data[key]);

					if (typeof data[key] === "number") {
						this.setObjectNotExistsAsync(newPath, {
							type: "state",
							common: {
								name: key,
								type: "number",
								role: "indicator",
								read: true,
								write: true,
							},
							native: {},
						});
					} else if (typeof data[key] === "boolean") {
						this.setObjectNotExistsAsync(newPath, {
							type: "state",
							common: {
								name: key,
								type: "boolean",
								role: "indicator",
								read: true,
								write: true,
							},
							native: {},
						});
					} else if (typeof data[key] === "string") {
						this.setObjectNotExistsAsync(newPath, {
							type: "state",
							common: {
								name: key,
								type: "string",
								role: "value",
								read: true,
								write: true,
							},
							native: {},
						});
					}

					this.setStateAsync(newPath, data[key]);
				}
			}
		}
	}
}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Ethermine(options);
} else {
	// otherwise start the instance directly
	(() => new Ethermine())();
}

interface Wallet {
	name: string;
	enabled: boolean;
	address: string;
}