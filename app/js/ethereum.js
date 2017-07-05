
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
console.log('Web3 Lib:', web3);
console.log('ETH accounts:', web3.eth.accounts);
$.getJSON("/contracts/StandardToken.json", function(token) {
    console.log('StandardToken', token);
    var data = web3.eth.contract(token.abi).new.getData({data: token.unlinked_binary});
    var estimatedGas = web3.eth.estimateGas({data: data})+1000;
    web3.eth.contract(token.abi).new({data: data, gas: estimatedGas, from: web3.eth.accounts[0]}, function(err, tokenContract){
      if (tokenContract.address){
        console.log('Standard Token deployed on ', tokenContract.address, ' instance of StandardToken on web3', tokenContract);
      }
    });
});
