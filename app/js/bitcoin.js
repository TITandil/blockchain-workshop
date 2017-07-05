
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');
console.log('Bitcore Lib:', bitcore);

var privateKey = new bitcore.PrivateKey.fromWIF('KzSAwJttccZeCkcL6akGFthCBG5PgQwPQY2YP6vuAWX1tKmwLSnL');
console.log(privateKey.toWIF())
var publicKey = privateKey.toPublicKey();
var address = new bitcore.Address(publicKey, bitcore.Networks.testnet);
console.log('Testnet address', address.toString());


var signature = Message('hello, world').sign(privateKey);
var address = address.toString();
var verified = Message('hello, world').verify(address, signature);

console.log('Signature', signature, 'from', address, 'is', verified);

$.get('http://tbtc.blockr.io/api/v1/address/info/mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib', function(responseText) {
  console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib Balance', responseText.data.balance);
});
