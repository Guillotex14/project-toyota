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
Object.defineProperty(exports, "__esModule", { value: true });
exports.templatesNotifies = void 0;
function templatesNotifies(template, data) {
    let templat = "";
    switch (template) {
        case "ofertBuyCar":
            break;
        case "ofertApprove":
            break;
        case "ofertReject":
            break;
        case "newInspect":
            break;
        case "mechanicalFileApprove":
            break;
        case "mechanicalFileReject":
            break;
        default:
            break;
    }
    return templat;
}
exports.templatesNotifies = templatesNotifies;
const ofertBuyCar = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
const ofertApprove = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
const ofertReject = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
const newInspect = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
const mechanicalFileApprove = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
const mechanicalFileReject = (data) => __awaiter(void 0, void 0, void 0, function* () {
});
//# sourceMappingURL=templates.notifications.js.map