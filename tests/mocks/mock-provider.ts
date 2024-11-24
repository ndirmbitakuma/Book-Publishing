export class MockProvider {
	private accounts: { [key: string]: { address: string; balance: number } } = {};
	private contracts: { [key: string]: any } = {};
	
	constructor() {
		this.accounts = {
			owner: { address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', balance: 1000000000 },
			author: { address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', balance: 1000000000 },
			reader: { address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC', balance: 1000000000 },
			rightsBuyer: { address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG
				87ND', balance: 1000000000 },
				distributor: { address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB', balance: 1000000000 },
				nonOwner: { address: 'ST2RNEQKZ3GYFBQQF8Y8RKG9GN5XB4JZND2CKTZBI', balance: 1000000000 },
			};
		}
		
		getAccount(name: string) {
			return this.accounts[name];
		}
		
		async getBalance(address: string): Promise<number> {
			return this.accounts[address].balance;
		}
		
		setContract(name: string, contract: any) {
			this.contracts[name] = contract;
		}
		
		getContract(name: string) {
			return this.contracts[name];
		}
		
		// Add more methods to simulate contract calls and interactions
	}
