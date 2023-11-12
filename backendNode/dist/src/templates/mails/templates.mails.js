"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templatesMails = void 0;
const templatesMails = (template, data) => {
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
};
exports.templatesMails = templatesMails;
const ofertBuyCar = (data) => {
    const template = `<div>
                        <p>Tienes una oferta de compra para:</p>
                    </div>
                    <div class="div-table" style="width: 100%;">
                        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
                        <div style=" display: table-row;border: 1px solid #000;">
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">
                                data?.model
                            </div>
                        </div>
                        <div style=" display: table-row;border: 1px solid #000;">
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">
                                data?.year
                            </div>
                        </div>
                        <div style=" display: table-row;border: 1px solid #000;">
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">
                                data?.plate
                            </div>
                        </div>
                        <div style=" display: table-row;border: 1px solid #000;">
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">
                                data?.fullName
                            </div>
                        </div>
                        <div style=" display: table-row;border: 1px solid #000;">
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">
                                data!.concesionary
                            </div>
                        </div>
                        <div style=" display: table-row;border: 1px solid #000;">
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
                            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">
                                data?.city
                            </div>
                        </div>
                    </div>
                </div>`;
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