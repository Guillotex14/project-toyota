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
        case "add_request_models_brands":
            templat = add_request_models_brands(data);
            break;
        case "approve_request_models_brands":
            templat = approve_request_models_brands(data);
            break;
        case "success_request_models_brands":
            templat = success_request_models_brands(data);
            break;
        case "cancel_request_models_brands":
            templat = cancel_request_models_brands(data);
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
const add_request_models_brands = (data) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud para agregar marca: ${data.branch} y modelo:${data.model}`;
    }
    else if (data.model) {
        message = `Solidud para agregar el modelo: ${data.model}`;
    }
    else if (data.branch) {
        message = `Solidud para agregar la marca: ${data.model}`;
    }
    const template = `<div>
    <p>Solitud enviada</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${message}</div>
        </div>
        </div>
    </div>`;
    return template;
};
const approve_request_models_brands = (data) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud aprobada para la marca: ${data.branch} y modelo:${data.model}`;
    }
    else if (data.model) {
        message = `Solidud aprobada para el modelo: ${data.model}`;
    }
    else if (data.branch) {
        message = `Solidud aprobada para la marca: ${data.model}`;
    }
    const template = `<div>
    <p>Solitud aprobada</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${message}</div>
        </div>
        </div>
    </div>`;
    return template;
};
const success_request_models_brands = (data) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud agregada para la marca: ${data.branch} y modelo:${data.model} con exito`;
    }
    else if (data.model) {
        message = `Solidud agregada para el modelo: ${data.model} con exito`;
    }
    else if (data.branch) {
        message = `Solidud agregada para la marca: ${data.model} con exito`;
    }
    const template = `<div>
    <p>Solitud finalizada</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${message}</div>
        </div>
        </div>
    </div>`;
    return template;
};
const cancel_request_models_brands = (data) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud cancelada para la marca: ${data.branch} y modelo:${data.model} con exito`;
    }
    else if (data.model) {
        message = `Solidud cancelada para el modelo: ${data.model} con exito`;
    }
    else if (data.branch) {
        message = `Solidud cancelada para la marca: ${data.model} con exito`;
    }
    const template = `<div>
    <p>Solitud cancelada</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${message}</div>
        </div>
        </div>
    </div>`;
    return template;
};
//# sourceMappingURL=templates.notifications.js.map