module.exports = [ {
	"inputs": [{
		"internalType": "uint256",
		"name": "amountIn",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "amountOutMin",
		"type": "uint256"
	}, {
		"internalType": "address[]",
		"name": "path",
		"type": "address[]"
	}, {
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "deadline",
		"type": "uint256"
	}],
	"name": "swapExactTokensForTokens",
	"outputs": [{
		"internalType": "uint256[]",
		"name": "amounts",
		"type": "uint256[]"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}
]