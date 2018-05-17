var BigNumber = require('bignumber.js');
angular.module('ethExplorer')
    .controller('blockInfosCtrl', function ($rootScope, $scope, $location, $routeParams,$q) {

        $scope.init=function()
        {


            $scope.blockId=$routeParams.blockId;


            if($scope.blockId!==undefined) {

                getBlockInfos()
                    .then(function(result){
                        var number = web3.eth.blockNumber;

                    $scope.result = result;

                    $scope.numberOfUncles = result.uncles.length;

                    //if ($scope.numberOfUncles!=0) {
                    //	uncle1=result.uncles[0];
                    //	console.log(web3.eth.getUncle(uncle1));
                    //}

                    if(result.hash!==undefined){
                        $scope.hash = result.hash;
                    }
                    else{
                        $scope.hash ='pending';
                    }
                    if(result.miner!==undefined){
                        $scope.miner = result.miner;
                    }
                    else{
                        $scope.miner ='pending';
                    }
                    $scope.gasLimit = result.gasLimit;
                    $scope.gasUsed = result.gasUsed;
                    $scope.nonce = result.nonce;
                    var diff = ("" + result.difficulty).replace(/['"]+/g, '') / 1000000;
                    $scope.difficulty = diff.toFixed(2) + " MH";
                    $scope.gasLimit = new BigNumber(result.gasLimit).toFormat(0) + " m/s"; // that's a string
                    $scope.gasUsed = new BigNumber(result.gasUsed).toFormat(0) + " m/s";
                    $scope.nonce = result.nonce;
                    $scope.number = result.number;
                    $scope.parentHash = result.parentHash;
                    $scope.uncledata = result.sha3Uncles;
                    $scope.rootHash = result.stateRoot;
                    $scope.blockNumber = result.number;
                    $scope.timestamp = new Date(result.timestamp * 1000).toUTCString();
                    $scope.extraData = result.extraData.slice(2);
                    $scope.dataFromHex = hex2a(result.extraData.slice(2)).replace(/[^\w\s]/gi, '_').replace(/^_*/g,'');
                    $scope.size = result.size;
                    $scope.firstBlock = false;
                    $scope.lastBlock = false;
                    if ($scope.blockNumber !== undefined){
                            $scope.conf = number - $scope.blockNumber + " Confirmations";
                            if (number === $scope.blockNumber){
                                $scope.conf = 'Unconfirmed';
                                $scope.lastBlock = true;
                            }
                            if ($scope.blockNumber === 0) {
                                $scope.firstBlock = true;
                            }
                        }

                        if ($scope.blockNumber !== undefined){
                            var info = web3.eth.getBlock($scope.blockNumber);
                            if (info !== undefined){
                                var newDate = new Date();
                                newDate.setTime(info.timestamp * 1000);
                                $scope.time = newDate.toUTCString();
                            }
                        }
                    });

            } else {
                $location.path("/");
            }


            function getBlockInfos(){
                var deferred = $q.defer();

                web3.eth.getBlock($scope.blockId,function(error, result) {
                    if(!error){
                        deferred.resolve(result);
                    }
                    else{
                        deferred.reject(error);
                    }
                });
                return deferred.promise;

            }


        };
        $scope.init();

        // parse transactions
        $scope.transactions = []

        web3.eth.getBlockTransactionCount($scope.blockId, function(error, result){
            if($scope.blockId == 0){

                $scope.numberOfTransactions = 3;
                var transaction = {
                    id: "GENESIS_0xc22fa356a0c1c5b9073958495db7e836e581ac19",
                    hash: "GENESIS_0xc22fa356a0c1c5b9073958495db7e836e581ac19",
                    from: "GENESIS",
                    to: "0xc22fa356a0c1c5b9073958495db7e836e581ac19",
                    gas: 0,
                    input: "OK",
                    value: 1e+25,
                    contractAddress: ""
                }
                $scope.$apply(
                    $scope.transactions.push(transaction)
                )
                var transaction2 = {
                    id: "GENESIS_0xa96e6618b7c97095c4c9fd8e247aaef647ef35cd",
                    hash: "GENESIS_0xa96e6618b7c97095c4c9fd8e247aaef647ef35cd",
                    from: "GENESIS",
                    to: "0xa96e6618b7c97095c4c9fd8e247aaef647ef35cd",
                    gas: 0,
                    input: "OK",
                    value: 1e+25,
                    contractAddress: ""
                }
                $scope.$apply(
                    $scope.transactions.push(transaction2)
                )
                var transaction3 = {
                    id: "GENESIS_0xbf16be05a48cbfd8b1f10ec3bc70cdcf1e3c48a3",
                    hash: "GENESIS_0xbf16be05a48cbfd8b1f10ec3bc70cdcf1e3c48a3",
                    from: "GENESIS",
                    to: "0xbf16be05a48cbfd8b1f10ec3bc70cdcf1e3c48a3",
                    gas: 0,
                    input: "OK",
                    value: 1.2e+25,
                    contractAddress: ""
                }
                $scope.$apply(
                    $scope.transactions.push(transaction3)
                )


            }else{

                var txCount = result;
                $scope.numberOfTransactions = txCount;
                for (var blockIdx = 0; blockIdx < txCount; blockIdx++) {
                    web3.eth.getTransactionFromBlock($scope.blockId, blockIdx, function(error, result) {
                        // console.log("Result: ", result);
                        web3.eth.getTransactionReceipt(result.hash, function(error, receipt) {
                            var transaction = {
                                id: receipt.transactionHash,
                                hash: receipt.transactionHash,
                                from: receipt.from,
                                to: receipt.to,
                                gas: receipt.gasUsed,
                                input: result.input.slice(2),
                                value: result.value,
                                contractAddress: receipt.contractAddress
                            }
                            $scope.$apply(
                                $scope.transactions.push(transaction)
                            );
                        });
                    })
                }
            }


        });

function hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));

    return str;
}
});
