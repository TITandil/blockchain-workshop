# Blockchain Workshop

## Requisites

* nodejs v7.8.0
* npm 4.2.0
* bower 1.8.0

## Install

```sh
git clone https://github.com/TITandil/blockchain-workshop
cd blockchain-workshop
npm install http-server -g
npm install
bower install
```

If you choose to build an ethereum app also execute:

```sh
npm install ethereumjs-testrpc -g
npm install truffle -g
npm run copy-contracts
npm run compile
```

## Run

Just execute `npm start` and it will start an http server, the app will be available on `http://localhost:8080`

## Test

The ethereum app will need to have `testrpc` running as process when it is used, also you need to compile the contracts before start the app with the command `truffle compile`.

The bitcoin app will use the bitcoin testnet.
