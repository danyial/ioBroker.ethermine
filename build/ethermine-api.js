"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthermineAPI = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class EthermineAPI {
    constructor(wallet) {
        this._wallet = wallet;
    }
    showWallet() {
        return this._wallet;
    }
    async currentStats() {
        const response = await this.getData("currentStats");
        if (response["status"] !== "OK") {
            return {};
        }
        return response;
    }
    async dashboard() {
        const response = await this.getData("dashboard");
        if (response["status"] !== "OK") {
            return {};
        }
        return response;
    }
    async history() {
        const response = await this.getData("history");
        if (response["status"] !== "OK") {
            return {};
        }
        return response;
    }
    async payouts() {
        const response = await this.getData("payouts");
        if (response["status"] !== "OK") {
            return {};
        }
        return response;
    }
    async rounds() {
        const response = await this.getData("rounds");
        if (response["status"] !== "OK") {
            return {};
        }
        return response;
    }
    async settings() {
        const response = await this.getData("settings");
        if (response["status"] !== "OK") {
            return {};
        }
        return response;
    }
    async getData(request) {
        const response = await node_fetch_1.default(`https://api.ethermine.org/miner/${this._wallet}/${request}`);
        const body = await response.json();
        return body;
    }
}
exports.EthermineAPI = EthermineAPI;
