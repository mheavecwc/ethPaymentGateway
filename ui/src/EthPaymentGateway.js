export class EthPaymentGateway{
    constructor(network, contractAddress){
        this.web3Instance = new Web3(new Web3.providers.HttpProvider(network));
        this.contractAddress = contractAddress;
        this.priceDiscoveryUrl = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=GBP";
        this.contractAbiUrl = "http://127.0.0.1/src/gateway-contract-abi.json";
    }    

    async makePayment(merchant, ether, reference){
        let contract = await this.getContract();
        let priceInWei = this.web3Instance.toWei(ether, 'ether');
        var result = await contract.makePayment(merchant, reference, {value : priceInWei});
        return result;
     }

     async getPaymentStatusFromMerchantAndReference(merchant, reference){
        let events = await this.getEventsFromBlocks(EventType.PaymentMadeEvent, 0, 'latest');
        for(let e = 0; e < events.length; e++){
            let event = events[e];
            if(event.args._merchant.toLowerCase() == merchant.toLowerCase() && event.args._reference == reference){
                return this.paymentStatus(event);
            }
        }
        return this.paymentStatus(null);         
     }

     async getPaymentReceivedStatusFromHash(txHash){
        let txReceipt = await this.getTransactionReceiptFromNetwork(txHash);
        if(!txReceipt){
            return this.paymentStatus(null);
        }         

        var blockNumber = txReceipt.blockNumber;
        let events = await this.getEventsFromBlocks(EventType.PaymentMadeEvent, blockNumber, blockNumber);
        let event = this.getEventFromListUsingTxHash(events, txHash);
        return this.paymentStatus(event);
    }


    /*
        Admin
    */

    async addMerchant(address, name){
        console.log("add merchant");
        let contract = await this.getContract();
        var result = await contract.addMerchant(address, name);
        return result;
    }

    async withdrawMerchantBalance(merchant){
        let contract = await this.getContract();
        let tx = await contract.withdrawPayment(merchant);
        return tx;
    }

    async withdrawGatewayFees(){
        let contract = await this.getContract();
        let tx = await contract.withdrawGatewayFees();
        return tx;       
    }    

    async getGatewayWithdrawalHistory(){
        let events = await this.getEventsFromBlocks(EventType.WithdrawGatewayFundsEvent, 0, 'latest');
        return this.createWithdrawalEventArray(events);       
    }
    
    async getMerchantWithdrawalHistory(){
        let events = await this.getEventsFromBlocks(EventType.WithdrawPaymentEvent, 0, 'latest');
        return this.createWithdrawalEventArray(events);
    }

    /*
        Utilities
    */
    async getCostInWeiFromCostInGbp(amountInGbp){
        let response = await fetch(this.priceDiscoveryUrl);
        let data = await response.json();
        let price = this.calculateCost(amountInGbp, data.GBP);
        return price;
    }

    async getContract(){
        this.contractAbi = await this.getContractAbi();
        var contract = await this.web3Instance.eth.contract(this.contractAbi).at(this.contractAddress);
        return contract;
    }    

    async getContractAbi(){
        let response = await fetch(this.contractAbiUrl);
        let data = await response.json();
        return data.abi;
    }      

    async getTransactionReceiptFromNetwork(txHash){
        let txReceipt = await this.web3Instance.eth.getTransactionReceipt(txHash);
        return txReceipt;
    }        

    async getEventsFromBlocks(eventType, fromBlock, toBlock){
        let contract = await this.getContract();
        let eventsCallback = null;
        if(eventType == EventType.PaymentMadeEvent){
            eventsCallback = this.promisify(cb => contract.PaymentMadeEvent({}, { fromBlock: fromBlock, toBlock: toBlock }).get(cb));
        }
        if(eventType == EventType.WithdrawPaymentEvent){
            eventsCallback = this.promisify(cb => contract.WithdrawPaymentEvent({}, { fromBlock: fromBlock, toBlock: toBlock }).get(cb));
        }     
        if(eventType == EventType.WithdrawGatewayFundsEvent){
            eventsCallback = this.promisify(cb => contract.WithdrawGatewayFundsEvent({}, { fromBlock: fromBlock, toBlock: toBlock }).get(cb));            
        }

        if(!eventsCallback){
            return null;
        }
        let events = await eventsCallback;
        return events;          
    }

    createWithdrawalEventArray(events){
        let eventArray = [];
        for(let e = 0; e < events.length; e++){
            let event = events[e];
            console.log(event);
            eventArray.push(this.withdrawalRecord(event));
        }
        return eventArray;          
    }

    getEventFromListUsingTxHash(events, txHash){
        for(let e = 0; e < events.length; e++){
            let event = events[e];
            if(event.transactionHash == txHash){
                return event;
            }
        }
        return null;
    }

    calculateCost(unitCostPerItem, unitsPerEth){
        let costInEth = unitCostPerItem / unitsPerEth;
        return costInEth;
    } 

    promisify(inner){
        return new Promise((resolve, reject) =>
                    inner((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
        ); 
    }

    /*
        Models
    */
    paymentStatus(paymentEvent){
        if(paymentEvent == undefined || paymentEvent == null){
            return {};
        }

        return {merchant: paymentEvent.args._merchant, 
                reference: paymentEvent.args._reference,
                amountInWei: paymentEvent.args._amount.c[0] };
    }   

    withdrawalRecord(merchantWithdrawalEvent){
        if(merchantWithdrawalEvent == undefined || merchantWithdrawalEvent == null){
            return {};
        }        

        return { merchant: merchantWithdrawalEvent.args._walletAddress,
                 amountInWei: merchantWithdrawalEvent.args._amount.c[0]};
    }
}

const EventType = {
    PaymentMadeEvent: "PaymentMadeEvent",
    WithdrawGatewayFundsEvent: "WithdrawGatewayFundsEvent",
    WithdrawPaymentEvent: "WithdrawPaymentEvent"  
}
