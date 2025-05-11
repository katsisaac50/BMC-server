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
exports.generatePatientReport = void 0;
var pdf_lib_1 = require("pdf-lib");
var Patient_1 = require("../models/Patient");
var fs_1 = require("fs");
var path_1 = require("path");
var generatePatientReport = function (patientId) { return __awaiter(void 0, void 0, void 0, function () {
    var patient, pdfDoc, page, _a, width, height, font, yPosition, addText, reportsDir, filename, filepath, pdfBytes;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, Patient_1.default.findById(patientId)
                    .populate('appointments')
                    .populate('prescriptions')
                    .lean()];
            case 1:
                patient = _d.sent();
                if (!patient) {
                    throw new Error('Patient not found');
                }
                return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
            case 2:
                pdfDoc = _d.sent();
                page = pdfDoc.addPage([600, 800]);
                _a = page.getSize(), width = _a.width, height = _a.height;
                return [4 /*yield*/, pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica)];
            case 3:
                font = _d.sent();
                // Add content
                page.drawText("Patient Report: ".concat(patient.name), {
                    x: 50,
                    y: height - 50,
                    size: 20,
                    font: font,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0)
                });
                yPosition = height - 100;
                addText = function (text, size) {
                    if (size === void 0) { size = 12; }
                    page.drawText(text, { x: 50, y: yPosition, size: size, font: font });
                    yPosition -= size + 10;
                };
                addText("Date of Birth: ".concat(((_b = patient.dateOfBirth) === null || _b === void 0 ? void 0 : _b.toLocaleDateString()) || 'N/A'));
                addText("Gender: ".concat(patient.gender || 'N/A'));
                addText("Blood Type: ".concat(patient.bloodType || 'N/A'));
                addText("Last Visit: ".concat(patient.lastVisit.toLocaleDateString()));
                addText("Status: ".concat(patient.status));
                // Add appointments section
                yPosition -= 20;
                addText('Recent Appointments:', 14);
                (_c = patient.appointments) === null || _c === void 0 ? void 0 : _c.forEach(function (appt) {
                    addText("".concat(appt.date.toLocaleDateString(), " - ").concat(appt.reason));
                });
                reportsDir = path_1.default.join(__dirname, '../../reports');
                if (!fs_1.default.existsSync(reportsDir)) {
                    fs_1.default.mkdirSync(reportsDir);
                }
                filename = "patient_".concat(patient._id, "_").concat(Date.now(), ".pdf");
                filepath = path_1.default.join(reportsDir, filename);
                return [4 /*yield*/, pdfDoc.save()];
            case 4:
                pdfBytes = _d.sent();
                fs_1.default.writeFileSync(filepath, pdfBytes);
                return [2 /*return*/, {
                        filepath: filepath,
                        filename: filename,
                        patient: patient
                    }];
        }
    });
}); };
exports.generatePatientReport = generatePatientReport;
