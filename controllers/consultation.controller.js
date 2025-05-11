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
exports.getUpcomingConsultations = exports.getConsultationRecordings = exports.completeConsultation = exports.initiateConsultation = exports.scheduleConsultation = void 0;
var videoConference_service_1 = require("../services/videoConference.service");
var Consultation_1 = require("../models/Consultation");
var express_async_handler_1 = require("express-async-handler");
var consultation_validations_1 = require("../validations/consultation.validations");
exports.scheduleConsultation = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patientId, doctorId, scheduledAt, duration, consultationType, consultation;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, consultation_validations_1.validateConsultationRequest)(req)];
            case 1:
                _b.sent();
                _a = req.body, patientId = _a.patientId, doctorId = _a.doctorId, scheduledAt = _a.scheduledAt, duration = _a.duration, consultationType = _a.consultationType;
                return [4 /*yield*/, Consultation_1.default.create({
                        patient: patientId,
                        doctor: doctorId,
                        scheduledAt: scheduledAt,
                        duration: duration || 30,
                        consultationType: consultationType || 'video'
                    })];
            case 2:
                consultation = _b.sent();
                res.status(201).json({
                    success: true,
                    data: consultation
                });
                return [2 /*return*/];
        }
    });
}); });
exports.initiateConsultation = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var consultationId, consultation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                consultationId = req.params.consultationId;
                return [4 /*yield*/, (0, videoConference_service_1.createVideoRoom)(consultationId)];
            case 1:
                consultation = _a.sent();
                res.status(200).json({
                    success: true,
                    data: consultation
                });
                return [2 /*return*/];
        }
    });
}); });
exports.completeConsultation = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var consultationId, _a, notes, diagnosis, followUp, updatedConsultation;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                consultationId = req.params.consultationId;
                _a = req.body, notes = _a.notes, diagnosis = _a.diagnosis, followUp = _a.followUp;
                return [4 /*yield*/, (0, videoConference_service_1.endVideoRoom)(consultationId)];
            case 1:
                _b.sent();
                return [4 /*yield*/, Consultation_1.default.findByIdAndUpdate(consultationId, {
                        notes: notes,
                        diagnosis: diagnosis,
                        followUp: followUp ? new Date(followUp) : undefined,
                        status: 'completed',
                        endedAt: new Date()
                    }, { new: true })];
            case 2:
                updatedConsultation = _b.sent();
                res.status(200).json({
                    success: true,
                    data: updatedConsultation
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getConsultationRecordings = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var consultationId, recordings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                consultationId = req.params.consultationId;
                return [4 /*yield*/, (0, videoConference_service_1.getRoomRecordings)(consultationId)];
            case 1:
                recordings = _a.sent();
                res.status(200).json({
                    success: true,
                    data: recordings
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getUpcomingConsultations = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, role, _b, days, dateFilter, query, consultations;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.user, userId = _a.userId, role = _a.role;
                _b = req.query.days, days = _b === void 0 ? 7 : _b;
                dateFilter = new Date();
                dateFilter.setDate(dateFilter.getDate() + Number(days));
                query = role === 'doctor'
                    ? { doctor: userId }
                    : { patient: userId };
                return [4 /*yield*/, Consultation_1.default.find(__assign(__assign({}, query), { status: 'scheduled', scheduledAt: { $lte: dateFilter } }))
                        .populate('patient', 'name')
                        .populate('doctor', 'name')
                        .sort({ scheduledAt: 1 })];
            case 1:
                consultations = _c.sent();
                res.status(200).json({
                    success: true,
                    count: consultations.length,
                    data: consultations
                });
                return [2 /*return*/];
        }
    });
}); });
