"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandwidthMonitor = void 0;
var BandwidthMonitor = /** @class */ (function () {
    function BandwidthMonitor(consultationId) {
        this.consultationId = consultationId;
        this.connectionTests = [];
    }
    BandwidthMonitor.prototype.runInitialTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.performNetworkTest()];
                    case 1:
                        testResults = _a.sent();
                        this.connectionTests.push(testResults);
                        return [2 /*return*/];
                }
            });
        });
    };
    BandwidthMonitor.prototype.performNetworkTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testResult;
            return __generator(this, function (_a) {
                testResult = {
                    timestamp: new Date(),
                    downloadSpeed: Math.random() * 10 + 5, // 5-15 Mbps
                    latency: Math.random() * 100 + 50, // 50-150 ms
                    packetLoss: Math.random() * 5 // 0-5%
                };
                return [2 /*return*/, testResult];
            });
        });
    };
    BandwidthMonitor.prototype.getRecommendedQuality = function () {
        var latestTest = this.connectionTests.slice(-1)[0];
        if (!latestTest)
            return 'medium';
        if (latestTest.downloadSpeed < 3 || latestTest.latency > 200) {
            return 'low';
        }
        else if (latestTest.downloadSpeed < 6 || latestTest.latency > 100) {
            return 'medium';
        }
        else {
            return 'high';
        }
    };
    BandwidthMonitor.prototype.monitorConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var testResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.performNetworkTest()];
                            case 1:
                                testResult = _a.sent();
                                this.connectionTests.push(testResult);
                                // Keep only last 5 tests
                                if (this.connectionTests.length > 5) {
                                    this.connectionTests.shift();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }, 30000); // Test every 30 seconds
                return [2 /*return*/];
            });
        });
    };
    return BandwidthMonitor;
}());
exports.BandwidthMonitor = BandwidthMonitor;
