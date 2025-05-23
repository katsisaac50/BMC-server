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
exports.handleVideoWebhook = void 0;
var Consultation_1 = require("../models/Consultation");
var express_async_handler_1 = require("express-async-handler");
var logger_1 = require("../utils/logger");
var helpers_1 = require("../utils/helpers");
exports.handleVideoWebhook = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Verify webhook signature
                if (!(0, helpers_1.verifyWebhookSignature)(req)) {
                    return [2 /*return*/, res.status(401).json({ success: false, error: 'Invalid signature' })];
                }
                event = req.body;
                logger_1.default.info("Received video webhook event: ".concat(event.type));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 14, , 15]);
                _a = event.type;
                switch (_a) {
                    case 'room.started': return [3 /*break*/, 2];
                    case 'room.ended': return [3 /*break*/, 4];
                    case 'recording.ready': return [3 /*break*/, 6];
                    case 'participant.joined': return [3 /*break*/, 8];
                    case 'participant.left': return [3 /*break*/, 10];
                }
                return [3 /*break*/, 12];
            case 2: return [4 /*yield*/, handleRoomStarted(event)];
            case 3:
                _b.sent();
                return [3 /*break*/, 13];
            case 4: return [4 /*yield*/, handleRoomEnded(event)];
            case 5:
                _b.sent();
                return [3 /*break*/, 13];
            case 6: return [4 /*yield*/, handleRecordingReady(event)];
            case 7:
                _b.sent();
                return [3 /*break*/, 13];
            case 8: return [4 /*yield*/, handleParticipantJoined(event)];
            case 9:
                _b.sent();
                return [3 /*break*/, 13];
            case 10: return [4 /*yield*/, handleParticipantLeft(event)];
            case 11:
                _b.sent();
                return [3 /*break*/, 13];
            case 12:
                logger_1.default.debug("Unhandled event type: ".concat(event.type));
                _b.label = 13;
            case 13:
                res.status(200).json({ success: true });
                return [3 /*break*/, 15];
            case 14:
                error_1 = _b.sent();
                logger_1.default.error('Error handling webhook:', error_1);
                res.status(500).json({ success: false, error: 'Webhook processing failed' });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
function handleRoomStarted(event) {
    return __awaiter(this, void 0, void 0, function () {
        var roomName, consultationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomName = event.room.name;
                    consultationId = roomName.split('-')[1];
                    return [4 /*yield*/, Consultation_1.default.findByIdAndUpdate(consultationId, {
                            status: 'in-progress',
                            startedAt: new Date(event.timestamp * 1000)
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleRoomEnded(event) {
    return __awaiter(this, void 0, void 0, function () {
        var roomName, consultationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomName = event.room.name;
                    consultationId = roomName.split('-')[1];
                    return [4 /*yield*/, Consultation_1.default.findByIdAndUpdate(consultationId, {
                            status: 'completed',
                            endedAt: new Date(event.timestamp * 1000)
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleRecordingReady(event) {
    return __awaiter(this, void 0, void 0, function () {
        var roomName, consultationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomName = event.room;
                    consultationId = roomName.split('-')[1];
                    return [4 /*yield*/, Consultation_1.default.findByIdAndUpdate(consultationId, {
                            $push: { recordings: event.url }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleParticipantJoined(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function handleParticipantLeft(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
