"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templatesMails = void 0;
function templatesMails(template, data) {
    let templat = "";
    switch (template) {
        case "ofertByCar":
            templat = ofertBuyCar(data);
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
exports.templatesMails = templatesMails;
const ofertBuyCar = (data) => {
    const template = "";
    return template;
};
const ofertApprove = (data) => {
};
const ofertReject = (data) => {
};
const newInspect = (data) => {
};
const mechanicalFileApprove = (data) => {
};
const mechanicalFileReject = (data) => {
};
//# sourceMappingURL=templates.mails.js.map