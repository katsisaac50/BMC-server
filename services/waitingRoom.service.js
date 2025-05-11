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
exports.assignDoctorToPatient = exports.joinWaitingRoom = void 0;
var WaitingRoom_1 = require("../models/WaitingRoom");
var Consultation_1 = require("../models/Consultation");
var queueHelpers_1 = require("../utils/queueHelpers");
var joinWaitingRoom = function (patientId_1, department_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([patientId_1, department_1], args_1, true), void 0, function (patientId, department, priority) {
        var session, waitingRoom, _a, _b, _c, consultation, error_1;
        var _d, _e, _f;
        if (priority === void 0) { priority = 'medium'; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, mongoose.startSession()];
                case 1:
                    session = _g.sent();
                    session.startTransaction();
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 7, 9, 10]);
                    _b = (_a = WaitingRoom_1.default).findOneAndUpdate;
                    _c = [{ department: department }];
                    _d = {};
                    _e = {};
                    _f = {
                        patientId: patientId,
                        priority: priority
                    };
                    return [4 /*yield*/, (0, queueHelpers_1.calculateWaitTimes)(department)];
                case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.$push = (_e.currentQueue = (_f.estimatedWaitTime = _g.sent(),
                            _f),
                            _e), _d), { upsert: true, new: true, session: session }])).populate('currentQueue.patientId', 'name')];
                case 4:
                    waitingRoom = _g.sent();
                    return [4 /*yield*/, Consultation_1.default.create([{
                                patient: patientId,
                                consultationType: 'video',
                                status: 'scheduled',
                                department: department
                            }], { session: session })];
                case 5:
                    consultation = _g.sent();
                    return [4 /*yield*/, session.commitTransaction()];
                case 6:
                    _g.sent();
                    return [2 /*return*/, {
                            waitingRoom: waitingRoom,
                            position: waitingRoom.currentQueue.length,
                            estimatedWait: waitingRoom.currentQueue.slice(-1)[0].estimatedWaitTime
                        }];
                case 7:
                    error_1 = _g.sent();
                    return [4 /*yield*/, session.abortTransaction()];
                case 8:
                    _g.sent();
                    throw error_1;
                case 9:
                    session.endSession();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
};
exports.joinWaitingRoom = joinWaitingRoom;
var assignDoctorToPatient = function (department) { return __awaiter(void 0, void 0, void 0, function () {
    var waitingRoom, nextPatient, availableDoctor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, WaitingRoom_1.default.findOne({ department: department })
                    .populate('currentQueue.patientId')
                    .populate('onlineDoctors.doctorId')];
            case 1:
                waitingRoom = _a.sent();
                if (!waitingRoom)
                    throw new Error('No waiting room found');
                nextPatient = waitingRoom.currentQueue
                    .filter(function (p) { return p.status === 'waiting'; })
                    .sort(function (a, b) {
                    var priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority] ||
                        a.joinedAt - b.joinedAt;
                })[0];
                if (!nextPatient)
                    return [2 /*return*/, null];
                availableDoctor = waitingRoom.onlineDoctors
                    .find(function (d) { return d.available && d.lastPing > new Date(Date.now() - 30000); });
                if (!availableDoctor)
                    return [2 /*return*/, null];
                // Update records
                nextPatient.status = 'in-consultation';
                availableDoctor.available = false;
                return [4 /*yield*/, waitingRoom.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, {
                        patient: nextPatient.patientId,
                        doctor: availableDoctor.doctorId,
                        position: waitingRoom.currentQueue.indexOf(nextPatient) + 1
                    }];
        }
    });
}); };
exports.assignDoctorToPatient = assignDoctorToPatient;
