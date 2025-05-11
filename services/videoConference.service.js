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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomRecordings = exports.endVideoRoom = exports.createVideoRoom = void 0;
var axios_1 = require("axios");
var Consultation_1 = require("../models/Consultation");
var logger_1 = require("../utils/logger");
var helpers_1 = require("../utils/helpers");
// Using Daily.co as an example video API provider
var DAILY_API_KEY = process.env.DAILY_API_KEY;
var DAILY_API_URL = 'https://api.daily.co/v1';
var createVideoRoom = function (consultationId) { return __awaiter(void 0, void 0, void 0, function () {
    var consultation, expTime, response, patientToken, doctorToken, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Consultation_1.default.findById(consultationId)
                    .populate('patient', 'name')
                    .populate('doctor', 'name')];
            case 1:
                consultation = _a.sent();
                if (!consultation) {
                    throw new Error('Consultation not found');
                }
                expTime = Math.floor((new Date(consultation.scheduledAt).getTime() +
                    (consultation.duration + 60) * 60 * 1000) / 1000);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                return [4 /*yield*/, axios_1.default.post("".concat(DAILY_API_URL, "/rooms"), {
                        name: "consultation-".concat(consultationId),
                        privacy: 'private',
                        properties: {
                            enable_recording: 'cloud',
                            enable_chat: true,
                            eject_at_room_exp: true,
                            exp: expTime
                        }
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(DAILY_API_KEY),
                            'Content-Type': 'application/json'
                        }
                    })];
            case 3:
                response = _a.sent();
                patientToken = (0, helpers_1.generateJWT)({
                    roomName: response.data.name,
                    userId: "patient-".concat(consultation.patient._id),
                    userName: consultation.patient.name,
                    isOwner: false
                });
                doctorToken = (0, helpers_1.generateJWT)({
                    roomName: response.data.name,
                    userId: "doctor-".concat(consultation.doctor._id),
                    userName: consultation.doctor.name,
                    isOwner: true
                });
                // Update consultation with meeting details
                consultation.meetingUrl = "".concat(response.data.url, "?t=").concat(doctorToken);
                consultation.status = 'scheduled';
                return [4 /*yield*/, consultation.save()];
            case 4:
                _a.sent();
                return [2 /*return*/, __assign(__assign({}, consultation.toObject()), { patientToken: "".concat(response.data.url, "?t=").concat(patientToken) })];
            case 5:
                error_1 = _a.sent();
                logger_1.default.error('Failed to create video room:', error_1);
                throw new Error('Failed to create video consultation room');
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createVideoRoom = createVideoRoom;
var endVideoRoom = function (consultationId) { return __awaiter(void 0, void 0, void 0, function () {
    var consultation, roomName, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Consultation_1.default.findById(consultationId)];
            case 1:
                consultation = _a.sent();
                if (!consultation) {
                    throw new Error('Consultation not found');
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                roomName = "consultation-".concat(consultationId);
                return [4 /*yield*/, axios_1.default.delete("".concat(DAILY_API_URL, "/rooms/").concat(roomName), {
                        headers: {
                            Authorization: "Bearer ".concat(DAILY_API_KEY)
                        }
                    })];
            case 3:
                _a.sent();
                consultation.endedAt = new Date();
                consultation.status = 'completed';
                return [4 /*yield*/, consultation.save()];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                logger_1.default.error('Failed to end video room:', error_2);
                throw new Error('Failed to end video consultation');
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.endVideoRoom = endVideoRoom;
var getRoomRecordings = function (consultationId) { return __awaiter(void 0, void 0, void 0, function () {
    var roomName, response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                roomName = "consultation-".concat(consultationId);
                return [4 /*yield*/, axios_1.default.get("".concat(DAILY_API_URL, "/recordings?room=").concat(roomName), {
                        headers: {
                            Authorization: "Bearer ".concat(DAILY_API_KEY)
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.data.map(function (rec) { return rec.url; })];
            case 2:
                error_3 = _a.sent();
                logger_1.default.error('Failed to fetch recordings:', error_3);
                throw new Error('Failed to get consultation recordings');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRoomRecordings = getRoomRecordings;
