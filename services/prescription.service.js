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
exports.markAsFilled = exports.verifyPrescription = exports.createEPrescription = void 0;
var Prescription_1 = require("../models/Prescription");
var Consultation_1 = require("../models/Consultation");
var qrGenerator_1 = require("../utils/qrGenerator");
var smsService_1 = require("../utils/smsService");
var createEPrescription = function (consultationId, medications, pharmacyNotes) { return __awaiter(void 0, void 0, void 0, function () {
    var consultation, qrCode, prescription;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Consultation_1.default.findById(consultationId)
                    .populate('patient')
                    .populate('doctor')];
            case 1:
                consultation = _a.sent();
                if (!consultation)
                    throw new Error('Consultation not found');
                return [4 /*yield*/, (0, qrGenerator_1.generateQR)({
                        patientId: consultation.patient._id,
                        doctorId: consultation.doctor._id,
                        date: new Date(),
                        medications: medications
                    })];
            case 2:
                qrCode = _a.sent();
                return [4 /*yield*/, Prescription_1.default.create({
                        consultation: consultationId,
                        patient: consultation.patient._id,
                        doctor: consultation.doctor._id,
                        medications: medications,
                        pharmacyNotes: pharmacyNotes,
                        qrCode: qrCode
                    })];
            case 3:
                prescription = _a.sent();
                if (!consultation.patient.phone) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, smsService_1.sendSMS)(consultation.patient.phone, "Your e-prescription is ready. Show this code at any pharmacy: ".concat(qrCode))];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, prescription];
        }
    });
}); };
exports.createEPrescription = createEPrescription;
var verifyPrescription = function (qrCode) { return __awaiter(void 0, void 0, void 0, function () {
    var prescription;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Prescription_1.default.findOne({ qrCode: qrCode })
                    .populate('patient')
                    .populate('doctor')];
            case 1:
                prescription = _a.sent();
                if (!prescription)
                    throw new Error('Invalid prescription');
                if (prescription.isFilled)
                    throw new Error('Prescription already filled');
                if (new Date() > prescription.expiry)
                    throw new Error('Prescription expired');
                return [2 /*return*/, prescription];
        }
    });
}); };
exports.verifyPrescription = verifyPrescription;
var markAsFilled = function (prescriptionId, pharmacyId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Prescription_1.default.findByIdAndUpdate(prescriptionId, {
                    isFilled: true,
                    pharmacyNotes: "Filled at pharmacy: ".concat(pharmacyId, " on ").concat(new Date().toISOString())
                }, { new: true })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.markAsFilled = markAsFilled;
