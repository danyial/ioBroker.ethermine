/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.ts-files
 */

import { expect } from "chai";
import { EthermineAPI } from "./ethermine-api";
// import { functionToTest } from "./moduleToTest";

describe("module to test => function to test", () => {
	// initializing logic
	const expected = 5;

	it(`should return ${expected}`, () => {
		const result = 5;
		// assign result a value from functionToTest
		expect(result).to.equal(expected);
	});
	// ... more tests => it

});

// ... more test suites => describe
describe("Ethermine API => Show wallet address", () => {
	// initializing logic
	const expected = "WALLET_ADDRESS";

	it(`should return ${expected}`, () => {
		const api = new EthermineAPI(expected);
		const result = api.showWallet();
		// assign result a value from functionToTest
		expect(result).to.equal(expected);
	});
});