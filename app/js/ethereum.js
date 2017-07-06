
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
console.log('Web3 Lib:', web3);
console.log('ETH accounts:', web3.eth.accounts);

var workshopContract = {
  ABI: [],
  bytecode: "",
  address: "0x0000000000000000000000000000000000000000"
}

$.getJSON("/contracts/Workshop.json", function(json) {
    console.log('Workshop json:', json, '\n\n');
    workshopContract.ABI = json.abi;
    workshopContract.bytecode = json.unlinked_binary;
    var data = web3.eth.contract(workshopContract.ABI).new.getData({data: workshopContract.bytecode});
    var estimatedGas = web3.eth.estimateGas({data: data})+1000;
    web3.eth.contract(workshopContract.ABI).new({data: data, gas: estimatedGas, from: web3.eth.accounts[0]}, function(err, deployed){
      if (deployed.address){
        workshopContract.address = deployed.address;
        console.log('Workshop contract deployed on ', workshopContract.address, ' instance of Workshop on web3', deployed, '\n\n');

        var workshopInstance = web3.eth.contract(workshopContract.ABI).at(workshopContract.address);

        workshopInstance.AttendantAdded(function(error, result){
          if (!error)
            console.log('AttendantAdded event',result, '\n\n');
        });

        startWorkshop().then(function(result){
          console.log(result);
          console.log('Workshop running', workshopInstance.running(), '\n\n');
          return addAttendant('Jose');
        }).then(function(result){
          console.log(result);
          console.log('Workshop attendants', parseInt(workshopInstance.totalAttendants()), '\n\n');
          return addAttendant('German');
        }).then(function(result){
          console.log(result);
          console.log('Workshop attendants', parseInt(workshopInstance.totalAttendants()), '\n\n');
          return addAttendant('Mauricio');
        }).then(function(result){
          console.log(result);
          var totalAttendants = workshopInstance.totalAttendants();
          console.log('Workshop attendants list:');
          for (var i = 1; i < totalAttendants; i++) {
            console.log(workshopInstance.attendants(i));
          }
          console.log('\n\n');
          return stopWorkshop();
        }).then(function(result){
          console.log(result);
          console.log('Workshop running', workshopInstance.running());
        });
      }
    });
});

function startWorkshop(){
  return new Promise(function(resolve, reject){
    var data = web3.eth.contract(workshopContract.ABI).at(workshopContract.address).start.getData();
    web3.eth.sendTransaction({
      from: web3.eth.accounts[0],
      to: workshopContract.address,
      data: data
    }, function(err, result){
      if (err)
        reject(err);
      else
        resolve(result);
    })
  });
}

function stopWorkshop(){
  return new Promise(function(resolve, reject){
    var data = web3.eth.contract(workshopContract.ABI).at(workshopContract.address).stop.getData();
    web3.eth.sendTransaction({
      from: web3.eth.accounts[0],
      to: workshopContract.address,
      data: data
    }, function(err, result){
      if (err)
        reject(err);
      else
        resolve(result);
    })
  });
}

function addAttendant(name){
  return new Promise(function(resolve, reject){
    var data = web3.eth.contract(workshopContract.ABI).at(workshopContract.address).addAttendant.getData(name);
    web3.eth.sendTransaction({
      from: web3.eth.accounts[0],
      to: workshopContract.address,
      data: data
    }, function(err, result){
      if (err)
        reject(err);
      else
        resolve(result);
    })
  });
}
