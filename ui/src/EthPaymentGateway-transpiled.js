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
                                _context.next = 6;
                                return contract.makePayment(merchant, reference, { value: priceInWei });

                            case 6:
                                result = _context.sent;
                                return _context.abrupt("return", result);

                            case 8:
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
        key: "getPaymentStatusFromMerchantAndReference",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(merchant, reference) {
                var events, e, event;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.getEventsFromBlocks(EventType.PaymentMadeEvent, 0, 'latest');

                            case 2:
                                events = _context2.sent;
                                e = 0;

                            case 4:
                                if (!(e < events.length)) {
                                    _context2.next = 11;
                                    break;
                                }

                                event = events[e];

                                if (!(event.args._merchant.toLowerCase() == merchant.toLowerCase() && event.args._reference == reference)) {
                                    _context2.next = 8;
                                    break;
                                }

                                return _context2.abrupt("return", this.paymentStatus(event));

                            case 8:
                                e++;
                                _context2.next = 4;
                                break;

                            case 11:
                                return _context2.abrupt("return", this.paymentStatus(null));

                            case 12:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getPaymentStatusFromMerchantAndReference(_x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return getPaymentStatusFromMerchantAndReference;
        }()
    }, {
        key: "getPaymentReceivedStatusFromHash",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(txHash) {
                var txReceipt, blockNumber, events, event;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.getTransactionReceiptFromNetwork(txHash);

                            case 2:
                                txReceipt = _context3.sent;

                                if (txReceipt) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt("return", this.paymentStatus(null));

                            case 5:
                                blockNumber = txReceipt.blockNumber;
                                _context3.next = 8;
                                return this.getEventsFromBlocks(EventType.PaymentMadeEvent, blockNumber, blockNumber);

                            case 8:
                                events = _context3.sent;
                                event = this.getEventFromListUsingTxHash(events, txHash);
                                return _context3.abrupt("return", this.paymentStatus(event));

                            case 11:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getPaymentReceivedStatusFromHash(_x6) {
                return _ref3.apply(this, arguments);
            }

            return getPaymentReceivedStatusFromHash;
        }()

        /*
            Admin
        */

    }, {
        key: "addMerchant",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(address, name) {
                var contract, result;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                console.log("add merchant");
                                _context4.next = 3;
                                return this.getContract();

                            case 3:
                                contract = _context4.sent;
                                _context4.next = 6;
                                return contract.addMerchant(address, name);

                            case 6:
                                result = _context4.sent;
                                return _context4.abrupt("return", result);

                            case 8:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function addMerchant(_x7, _x8) {
                return _ref4.apply(this, arguments);
            }

            return addMerchant;
        }()
    }, {
        key: "withdrawMerchantBalance",
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(merchant) {
                var contract, tx;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context5.sent;
                                _context5.next = 5;
                                return contract.withdrawPayment(merchant);

                            case 5:
                                tx = _context5.sent;
                                return _context5.abrupt("return", tx);

                            case 7:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function withdrawMerchantBalance(_x9) {
                return _ref5.apply(this, arguments);
            }

            return withdrawMerchantBalance;
        }()
    }, {
        key: "withdrawGatewayFees",
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var contract, tx;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context6.sent;
                                _context6.next = 5;
                                return contract.withdrawGatewayFees();

                            case 5:
                                tx = _context6.sent;
                                return _context6.abrupt("return", tx);

                            case 7:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function withdrawGatewayFees() {
                return _ref6.apply(this, arguments);
            }

            return withdrawGatewayFees;
        }()
    }, {
        key: "getGatewayWithdrawalHistory",
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var events;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.getEventsFromBlocks(EventType.WithdrawGatewayFundsEvent, 0, 'latest');

                            case 2:
                                events = _context7.sent;
                                return _context7.abrupt("return", this.createWithdrawalEventArray(events));

                            case 4:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function getGatewayWithdrawalHistory() {
                return _ref7.apply(this, arguments);
            }

            return getGatewayWithdrawalHistory;
        }()
    }, {
        key: "getMerchantWithdrawalHistory",
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                var events;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.getEventsFromBlocks(EventType.WithdrawPaymentEvent, 0, 'latest');

                            case 2:
                                events = _context8.sent;
                                return _context8.abrupt("return", this.createWithdrawalEventArray(events));

                            case 4:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function getMerchantWithdrawalHistory() {
                return _ref8.apply(this, arguments);
            }

            return getMerchantWithdrawalHistory;
        }()

        /*
            Utilities
        */

    }, {
        key: "getCostInWeiFromCostInGbp",
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(amountInGbp) {
                var response, data, price;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return fetch(this.priceDiscoveryUrl);

                            case 2:
                                response = _context9.sent;
                                _context9.next = 5;
                                return response.json();

                            case 5:
                                data = _context9.sent;
                                price = this.calculateCost(amountInGbp, data.GBP);
                                return _context9.abrupt("return", price);

                            case 8:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function getCostInWeiFromCostInGbp(_x10) {
                return _ref9.apply(this, arguments);
            }

            return getCostInWeiFromCostInGbp;
        }()
    }, {
        key: "getContract",
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var contract;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.getContractAbi();

                            case 2:
                                this.contractAbi = _context10.sent;
                                _context10.next = 5;
                                return this.web3Instance.eth.contract(this.contractAbi).at(this.contractAddress);

                            case 5:
                                contract = _context10.sent;
                                return _context10.abrupt("return", contract);

                            case 7:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function getContract() {
                return _ref10.apply(this, arguments);
            }

            return getContract;
        }()
    }, {
        key: "getContractAbi",
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                var response, data;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return fetch(this.contractAbiUrl);

                            case 2:
                                response = _context11.sent;
                                _context11.next = 5;
                                return response.json();

                            case 5:
                                data = _context11.sent;
                                return _context11.abrupt("return", data.abi);

                            case 7:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function getContractAbi() {
                return _ref11.apply(this, arguments);
            }

            return getContractAbi;
        }()
    }, {
        key: "getTransactionReceiptFromNetwork",
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(txHash) {
                var txReceipt;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.web3Instance.eth.getTransactionReceipt(txHash);

                            case 2:
                                txReceipt = _context12.sent;
                                return _context12.abrupt("return", txReceipt);

                            case 4:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function getTransactionReceiptFromNetwork(_x11) {
                return _ref12.apply(this, arguments);
            }

            return getTransactionReceiptFromNetwork;
        }()
    }, {
        key: "getEventsFromBlocks",
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(eventType, fromBlock, toBlock) {
                var contract, eventsCallback, events;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.getContract();

                            case 2:
                                contract = _context13.sent;
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
                                    _context13.next = 9;
                                    break;
                                }

                                return _context13.abrupt("return", null);

                            case 9:
                                _context13.next = 11;
                                return eventsCallback;

                            case 11:
                                events = _context13.sent;
                                return _context13.abrupt("return", events);

                            case 13:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function getEventsFromBlocks(_x12, _x13, _x14) {
                return _ref13.apply(this, arguments);
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
