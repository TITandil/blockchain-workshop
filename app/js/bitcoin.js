
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');
console.log('Bitcore Lib:', bitcore);

var TEST_SEND = false;

// Try to use this private keys for testing
var pvKeys = [
  "KzSAwJttccZeCkcL6akGFthCBG5PgQwPQY2YP6vuAWX1tKmwLSnL",
  "KwEHTz121iQe385m57pYwiYYvq7YhVxYqerauiERgtY1Qam6qL97",
  "L33nscBVZuXkQFmFVDYWX5wJksTuJLfNHRZbAFio2dw8ybidsrBk",
  "L3LVKXuDMgKW8yYCKmD951T9WgRgdxshg8iYEzx5FN8uVuLQwwgk",
  "L4XtFC3tdmgkVtpbjnchheGQRefaYxdLxCw8smrkJvMMfd5jwkRC",
  "KxhqzYQwbak3x518dUTDhBUybRYXLq6MWHzfhJK2b5obfLbTxnUw",
  "KxmCS6gocupi6TQXMedbbccWwFfpAcLGwjzJD87e1bpnMytgHnUJ",
  "KzpoWosHW4WDhBE49uG6hRtZcr4WzywrsVNJKt3skvBYsP9mWmaf",
  "KytrYsrB9SmzuYTeGijusBqRijJVnRPnQEfy3P7ZzpmU4oAnQS9a",
  "Ky2YYMktoshWQo4HfZggUMdipQ1SpVc5RFFUZVbZPxsfcjrX35oW"
];
console.log('Private keys to use (WIF format):', pvKeys);

var privateKey = new bitcore.PrivateKey.fromWIF(pvKeys[0]);
var address = new bitcore.Address(privateKey.toPublicKey(), bitcore.Networks.testnet);
console.log('Main testnet address', address.toString());

var signature = Message('hello, world').sign(privateKey);
var address = address.toString();
var verified = Message('hello, world').verify(address, signature);

console.log('Signature', signature, 'from', address, 'is', verified);

// Get testnet info
console.log('Getting testnet info..');
$.get('http://tbtc.blockr.io/api/v1/coin/info', function(response) {
  console.log('BTC Testnet Info', response.data);
});

// Get balance of address
console.log('Getting address balance..');
$.get('http://tbtc.blockr.io/api/v1/address/info/mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib', function(response) {
  console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib Balance', response.data.balance);
});

// Get txs of address
console.log('Getting address txs..');
$.get('http://tbtc.blockr.io/api/v1/address/txs/mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib', function(response) {
  console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib Transactions', response.data);
});

if (TEST_SEND){
  
  //////////////////////// Build a bitcoin transaction ////////////////////////
  var toAddress = bitcore.Address(
    bitcore.PrivateKey.fromWIF(pvKeys[1]).toPublicKey(),
    bitcore.Networks.testnet
  );
  console.log('To address:',toAddress.toString());
  // Get the unspent outputs of address
  console.log('Getting address unspents..');
  $.get('http://tbtc.blockr.io/api/v1/address/unspent/mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib', function(response) {
    console.log('mpCX4JLdCNeUDjf5sfrsyQArBHrcVDDuib unspents', response.data);

    var blockrUnspents = response.data.unspent;
    var bitcoreUnspents = [];

    blockrUnspents.map(function(u, i){
      bitcoreUnspents.push(
        new bitcore.Transaction.UnspentOutput({
          "txid" : u.tx,
          "vout" : u.n,
          "scriptPubKey" : u.script,
          "amount" : u.amount
        })
      );
    });

    console.log('Bitcore unspents:', bitcoreUnspents);

    var transaction = new bitcore.Transaction()
      .from(bitcoreUnspents)          // Feed information about what unspent outputs one can use
      .to(toAddress.toString(), 10000)  // Add an output with the given amount of satoshis
      .change(address)      // Sets up a change address where the rest of the funds will go
      .sign(privateKey)     // Signs all the inputs it can

    console.log('Bitcore transaction:', transaction);
    console.log('Bitcore transaction hex:', transaction.serialize());

    $.post("http://tbtc.blockr.io/api/v1/tx/push", { "hex": transaction.serialize() } , function(txResponse) {
      console.log('Transaction push response:',txResponse)
    });

  });

  /////////////////////////////////////////////////////////////////////////////

}
