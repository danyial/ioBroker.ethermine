// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			wallet: string;
			currentStats: boolean;
			dashboard: boolean;
			history: boolean;
			payouts: boolean;
			rounds: boolean;
			settings: boolean;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};