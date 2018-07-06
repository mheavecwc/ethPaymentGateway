"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EthPaymentGateway = exports.EthPaymentGateway = function () {
    function EthPaymentGateway(network, contractAddress) {
        _classCallCheck(this, EthPaymentGateway);

        this.web3Instance = new Web3(new Web3.providers.HttpProvider(network));
        this.contractAddress = contractAddress;
        this.priceDiscoveryUrl = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=GBP";
        this.contractAbiUrl = "http://127.0.0.1/src/gateway-contract-abi.json";
    }

    _createClass(EthPaymentGateway, [{
        key: "makePayment",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(merchant, ether, reference) {
                var contract, priceInWei, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context.sent;
                                priceInWei = this.web3Instance.toWei(ether, 'ether');

                                console.log("ref:" + reference);
                                _context.next = 7;
                                return contract.makePayment(merchant, reference, { value: priceInWei });

                            case 7:
                                result = _context.sent;
                                return _context.abrupt("return", result);

                            case 9:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function makePayment(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return makePayment;
        }()
    }, {
        key: "makePaymentUsingTokens",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(merchant, reference, tokenAmount) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context2.sent;
                                _context2.next = 5;
                                return contract.makePaymentInTokens(merchant, reference, tokenAmount);

                            case 5:
                                result = _context2.sent;
                                return _context2.abrupt("return", result);

                            case 7:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function makePaymentUsingTokens(_x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
            }

            return makePaymentUsingTokens;
        }()
    }, {
        key: "getPaymentStatusFromMerchantAndReference",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(merchant, reference) {
                var events, e, event;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.getEventsFromBlocks(EventType.PaymentMadeEvent, 0, 'latest');

                            case 2:
                                events = _context3.sent;
                                e = 0;

                            case 4:
                                if (!(e < events.length)) {
                                    _context3.next = 11;
                                    break;
                                }

                                event = events[e];

                                if (!(event.args._merchant.toLowerCase() == merchant.toLowerCase() && event.args._reference == reference)) {
                                    _context3.next = 8;
                                    break;
                                }

                                return _context3.abrupt("return", this.paymentStatus(event));

                            case 8:
                                e++;
                                _context3.next = 4;
                                break;

                            case 11:
                                return _context3.abrupt("return", this.paymentStatus(null));

                            case 12:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getPaymentStatusFromMerchantAndReference(_x7, _x8) {
                return _ref3.apply(this, arguments);
            }

            return getPaymentStatusFromMerchantAndReference;
        }()
    }, {
        key: "getPaymentReceivedStatusFromHash",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(txHash) {
                var txReceipt, blockNumber, events, event;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.getTransactionReceiptFromNetwork(txHash);

                            case 2:
                                txReceipt = _context4.sent;

                                if (txReceipt) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt("return", this.paymentStatus(null));

                            case 5:
                                blockNumber = txReceipt.blockNumber;
                                _context4.next = 8;
                                return this.getEventsFromBlocks(EventType.PaymentMadeEvent, blockNumber, blockNumber);

                            case 8:
                                events = _context4.sent;
                                event = this.getEventFromListUsingTxHash(events, txHash);
                                return _context4.abrupt("return", this.paymentStatus(event));

                            case 11:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getPaymentReceivedStatusFromHash(_x9) {
                return _ref4.apply(this, arguments);
            }

            return getPaymentReceivedStatusFromHash;
        }()

        /*
            Admin
        */

    }, {
        key: "setTokenContractAddress",
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(address) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context5.sent;

                                console.log("set token contract address to:" + address);
                                _context5.next = 6;
                                return contract.setTokenContract(address);

                            case 6:
                                result = _context5.sent;
                                return _context5.abrupt("return", result);

                            case 8:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function setTokenContractAddress(_x10) {
                return _ref5.apply(this, arguments);
            }

            return setTokenContractAddress;
        }()
    }, {
        key: "issueTokens",
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(address, amount) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context6.sent;
                                _context6.next = 5;
                                return contract.issueTokens(address, amount);

                            case 5:
                                result = _context6.sent;
                                return _context6.abrupt("return", result);

                            case 7:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function issueTokens(_x11, _x12) {
                return _ref6.apply(this, arguments);
            }

            return issueTokens;
        }()
    }, {
        key: "addMerchant",
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(address, name) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                console.log("add merchant");
                                _context7.next = 3;
                                return this.getContract();

                            case 3:
                                contract = _context7.sent;
                                _context7.next = 6;
                                return contract.addMerchant(address, name);

                            case 6:
                                result = _context7.sent;
                                return _context7.abrupt("return", result);

                            case 8:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function addMerchant(_x13, _x14) {
                return _ref7.apply(this, arguments);
            }

            return addMerchant;
        }()
    }, {
        key: "withdrawMerchantBalance",
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(merchant) {
                var contract, tx;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context8.sent;
                                _context8.next = 5;
                                return contract.withdrawPayment(merchant);

                            case 5:
                                tx = _context8.sent;
                                return _context8.abrupt("return", tx);

                            case 7:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function withdrawMerchantBalance(_x15) {
                return _ref8.apply(this, arguments);
            }

            return withdrawMerchantBalance;
        }()
    }, {
        key: "withdrawGatewayFees",
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var contract, tx;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context9.sent;
                                _context9.next = 5;
                                return contract.withdrawGatewayFees();

                            case 5:
                                tx = _context9.sent;
                                return _context9.abrupt("return", tx);

                            case 7:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function withdrawGatewayFees() {
                return _ref9.apply(this, arguments);
            }

            return withdrawGatewayFees;
        }()
    }, {
        key: "getGatewayWithdrawalHistory",
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var events;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.getEventsFromBlocks(EventType.WithdrawGatewayFundsEvent, 0, 'latest');

                            case 2:
                                events = _context10.sent;
                                return _context10.abrupt("return", this.createWithdrawalEventArray(events));

                            case 4:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function getGatewayWithdrawalHistory() {
                return _ref10.apply(this, arguments);
            }

            return getGatewayWithdrawalHistory;
        }()
    }, {
        key: "getMerchantWithdrawalHistory",
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var events;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.getEventsFromBlocks(EventType.WithdrawPaymentEvent, 0, 'latest');

                            case 2:
                                events = _context11.sent;
                                return _context11.abrupt("return", this.createWithdrawalEventArray(events));

                            case 4:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function getMerchantWithdrawalHistory() {
                return _ref11.apply(this, arguments);
            }

            return getMerchantWithdrawalHistory;
        }()

        /*
            Utilities
        */

    }, {
        key: "getCostInWeiFromCostInGbp",
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(amountInGbp) {
                var response, data, price;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return fetch(this.priceDiscoveryUrl);

                            case 2:
                                response = _context12.sent;
                                _context12.next = 5;
                                return response.json();

                            case 5:
                                data = _context12.sent;
                                price = this.calculateCost(amountInGbp, data.GBP);
                                return _context12.abrupt("return", price);

                            case 8:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function getCostInWeiFromCostInGbp(_x16) {
                return _ref12.apply(this, arguments);
            }

            return getCostInWeiFromCostInGbp;
        }()
    }, {
        key: "getContract",
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var contract;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.getContractAbi();

                            case 2:
                                this.contractAbi = _context13.sent;
                                _context13.next = 5;
                                return this.web3Instance.eth.contract(this.contractAbi).at(this.contractAddress);

                            case 5:
                                contract = _context13.sent;
                                return _context13.abrupt("return", contract);

                            case 7:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function getContract() {
                return _ref13.apply(this, arguments);
            }

            return getContract;
        }()
    }, {
        key: "getContractAbi",
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                var response, data;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return fetch(this.contractAbiUrl);

                            case 2:
                                response = _context14.sent;
                                _context14.next = 5;
                                return response.json();

                            case 5:
                                data = _context14.sent;
                                return _context14.abrupt("return", data.abi);

                            case 7:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function getContractAbi() {
                return _ref14.apply(this, arguments);
            }

            return getContractAbi;
        }()
    }, {
        key: "getTransactionReceiptFromNetwork",
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(txHash) {
                var txReceipt;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return this.web3Instance.eth.getTransactionReceipt(txHash);

                            case 2:
                                txReceipt = _context15.sent;
                                return _context15.abrupt("return", txReceipt);

                            case 4:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function getTransactionReceiptFromNetwork(_x17) {
                return _ref15.apply(this, arguments);
            }

            return getTransactionReceiptFromNetwork;
        }()
    }, {
        key: "getEventsFromBlocks",
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(eventType, fromBlock, toBlock) {
                var contract, eventsCallback, events;
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context16.sent;
                                eventsCallback = null;

                                if (eventType == EventType.PaymentMadeEvent) {
                                    eventsCallback = this.promisify(function (cb) {
                                        return contract.PaymentMadeEvent({}, { fromBlock: fromBlock, toBlock: toBlock }).get(cb);
                                    });
                                }
                                if (eventType == EventType.WithdrawPaymentEvent) {
                                    eventsCallback = this.promisify(function (cb) {
                                        return contract.WithdrawPaymentEvent({}, { fromBlock: fromBlock, toBlock: toBlock }).get(cb);
                                    });
                                }
                                if (eventType == EventType.WithdrawGatewayFundsEvent) {
                                    eventsCallback = this.promisify(function (cb) {
                                        return contract.WithdrawGatewayFundsEvent({}, { fromBlock: fromBlock, toBlock: toBlock }).get(cb);
                                    });
                                }

                                if (eventsCallback) {
                                    _context16.next = 9;
                                    break;
                                }

                                return _context16.abrupt("return", null);

                            case 9:
                                _context16.next = 11;
                                return eventsCallback;

                            case 11:
                                events = _context16.sent;
                                return _context16.abrupt("return", events);

                            case 13:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function getEventsFromBlocks(_x18, _x19, _x20) {
                return _ref16.apply(this, arguments);
            }

            return getEventsFromBlocks;
        }()
    }, {
        key: "createWithdrawalEventArray",
        value: function createWithdrawalEventArray(events) {
            var eventArray = [];
            for (var e = 0; e < events.length; e++) {
                var event = events[e];
                console.log(event);
                eventArray.push(this.withdrawalRecord(event));
            }
            return eventArray;
        }
    }, {
        key: "getEventFromListUsingTxHash",
        value: function getEventFromListUsingTxHash(events, txHash) {
            for (var e = 0; e < events.length; e++) {
                var event = events[e];
                if (event.transactionHash == txHash) {
                    return event;
                }
            }
            return null;
        }
    }, {
        key: "calculateCost",
        value: function calculateCost(unitCostPerItem, unitsPerEth) {
            var costInEth = unitCostPerItem / unitsPerEth;
            return costInEth;
        }
    }, {
        key: "promisify",
        value: function promisify(inner) {
            return new Promise(function (resolve, reject) {
                return inner(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        }

        /*
            Models
        */

    }, {
        key: "paymentStatus",
        value: function paymentStatus(paymentEvent) {
            if (paymentEvent == undefined || paymentEvent == null) {
                return {};
            }

            return { merchant: paymentEvent.args._merchant,
                reference: paymentEvent.args._reference,
                amountInWei: paymentEvent.args._amount.c[0] };
        }
    }, {
        key: "withdrawalRecord",
        value: function withdrawalRecord(merchantWithdrawalEvent) {
            if (merchantWithdrawalEvent == undefined || merchantWithdrawalEvent == null) {
                return {};
            }

            return { merchant: merchantWithdrawalEvent.args._walletAddress,
                amountInWei: merchantWithdrawalEvent.args._amount.c[0] };
        }
    }]);

    return EthPaymentGateway;
}();

var EventType = {
    PaymentMadeEvent: "PaymentMadeEvent",
    WithdrawGatewayFundsEvent: "WithdrawGatewayFundsEvent",
    WithdrawPaymentEvent: "WithdrawPaymentEvent"
};

var EthPaymentGatewayToken = exports.EthPaymentGatewayToken = function () {
    function EthPaymentGatewayToken(network, contractAddress) {
        _classCallCheck(this, EthPaymentGatewayToken);

        this.web3Instance = new Web3(new Web3.providers.HttpProvider(network));
        this.contractAddress = contractAddress;
        this.contractAbiUrl = "http://127.0.0.1/src/erc20-contract-abi.json";
    }

    _createClass(EthPaymentGatewayToken, [{
        key: "getContract",
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                var contract;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.getContractAbi();

                            case 2:
                                this.contractAbi = _context17.sent;
                                _context17.next = 5;
                                return this.web3Instance.eth.contract(this.contractAbi).at(this.contractAddress);

                            case 5:
                                contract = _context17.sent;
                                return _context17.abrupt("return", contract);

                            case 7:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function getContract() {
                return _ref17.apply(this, arguments);
            }

            return getContract;
        }()
    }, {
        key: "getContractAbi",
        value: function () {
            var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                var response, data;
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.next = 2;
                                return fetch(this.contractAbiUrl);

                            case 2:
                                response = _context18.sent;
                                _context18.next = 5;
                                return response.json();

                            case 5:
                                data = _context18.sent;
                                return _context18.abrupt("return", data.abi);

                            case 7:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function getContractAbi() {
                return _ref18.apply(this, arguments);
            }

            return getContractAbi;
        }()
    }, {
        key: "issueTokens",
        value: function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(address, amount) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context19.sent;
                                _context19.next = 5;
                                return contract.issueTokens(address, amount);

                            case 5:
                                result = _context19.sent;
                                return _context19.abrupt("return", result);

                            case 7:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function issueTokens(_x21, _x22) {
                return _ref19.apply(this, arguments);
            }

            return issueTokens;
        }()
    }, {
        key: "getTokenIssueEvents",
        value: function () {
            var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
                var contract, eventsCallback, events;
                return regeneratorRuntime.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                _context20.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context20.sent;
                                eventsCallback = this.promisify(function (cb) {
                                    return contract.IssueTokens({}, { fromBlock: 0, toBlock: 'latest' }).get(cb);
                                });
                                _context20.next = 6;
                                return eventsCallback;

                            case 6:
                                events = _context20.sent;
                                return _context20.abrupt("return", events);

                            case 8:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this);
            }));

            function getTokenIssueEvents() {
                return _ref20.apply(this, arguments);
            }

            return getTokenIssueEvents;
        }()
    }, {
        key: "getBalance",
        value: function () {
            var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(address) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                _context21.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context21.sent;
                                _context21.next = 5;
                                return contract.balanceOf(address);

                            case 5:
                                result = _context21.sent;
                                return _context21.abrupt("return", result);

                            case 7:
                            case "end":
                                return _context21.stop();
                        }
                    }
                }, _callee21, this);
            }));

            function getBalance(_x23) {
                return _ref21.apply(this, arguments);
            }

            return getBalance;
        }()
    }, {
        key: "setPaymentContractAddress",
        value: function () {
            var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(address) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                _context22.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context22.sent;
                                _context22.next = 5;
                                return contract.setPaymentGatewayAddress(address);

                            case 5:
                                result = _context22.sent;
                                return _context22.abrupt("return", result);

                            case 7:
                            case "end":
                                return _context22.stop();
                        }
                    }
                }, _callee22, this);
            }));

            function setPaymentContractAddress(_x24) {
                return _ref22.apply(this, arguments);
            }

            return setPaymentContractAddress;
        }()
    }, {
        key: "promisify",
        value: function promisify(inner) {
            return new Promise(function (resolve, reject) {
                return inner(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        }
    }]);

    return EthPaymentGatewayToken;
}();
