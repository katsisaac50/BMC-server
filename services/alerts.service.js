"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlertStatsByPriority = exports.getSystemAlerts = void 0;
var Alert_1 = require("../models/Alert");
var logger_1 = require("../utils/logger");
var getSystemAlerts = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (filter, options) {
        var defaultOptions, error_1;
        if (filter === void 0) { filter = {}; }
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    defaultOptions = __assign({ sort: { createdAt: -1 }, limit: 20 }, options);
                    return [4 /*yield*/, Alert_1.default.find(filter)
                            .sort(defaultOptions.sort)
                            .limit(defaultOptions.limit)
                            .populate('relatedPatient', 'name')
                            .populate('relatedStaff', 'name role')
                            .lean()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    logger_1.default.error('Error fetching system alerts:', error_1);
                    throw new Error('Failed to fetch system alerts');
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getSystemAlerts = getSystemAlerts;
// Priority-based alert aggregation
var getAlertStatsByPriority = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Alert_1.default.aggregate([
                        {
                            $group: {
                                _id: '$priority',
                                count: { $sum: 1 },
                                unread: {
                                    $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
                                }
                            }
                        },
                        {
                            $project: {
                                priority: '$_id',
                                count: 1,
                                unread: 1,
                                _id: 0
                            }
                        },
                        {
                            $sort: {
                                priorityOrder: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ['$priority', 'critical'] }, then: 1 },
                                            { case: { $eq: ['$priority', 'high'] }, then: 2 },
                                            { case: { $eq: ['$priority', 'medium'] }, then: 3 },
                                            { case: { $eq: ['$priority', 'low'] }, then: 4 }
                                        ],
                                        default: 5
                                    }
                                }
                            }
                        }
                    ])];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_2 = _a.sent();
                logger_1.default.error('Error in alert aggregation:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAlertStatsByPriority = getAlertStatsByPriority;
