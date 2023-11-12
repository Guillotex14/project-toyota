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
            templat = ofertApprove(data);
            break;
        case "ofertReject":
            templat = ofertReject(data);
            break;
        case "newInspect":
            templat = newInspect(data);
            break;
        case "addMechanicalFile":
            templat = addMechanicalFile(data);
            break;
        case "mechanicalFileReject":
            templat = mechanicalFileReject(data);
            break;
        default:
            break;
    }
    return templat;
};
exports.templatesMails = templatesMails;
const ofertBuyCar = (data) => {
    const template = `<div>
    <p>Oferta de vehículo aprobada para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.fullName}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.city}</div>
        </div>
        </div>
    </div>`;
};
const ofertApprove = (data) => {
    const template = `<div>
    <p>Oferta de vehículo aprobada para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.fullName}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.city}</div>
        </div>
        </div>
    </div>`;
    return template;
};
const ofertReject = (data) => {
    const template = `<div>
    <p>Oferta de vehículo rechazada para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.fullName}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.city}</div>
        </div>
        </div>
    </div>`;
};
const newInspect = (data) => {
    const template = `<div>
    <p>Oferta de vehículo aprobada para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.fullName}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.city}</div>
        </div>
        </div>
    </div>`;
};
const addMechanicalFile = (data) => {
    const template = `<div>
    <p>Ficha técnica creada exitosamente para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.seller}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.state}</div>
        </div>
        </div>
    </div>`;
    return template;
};
const mechanicalFileReject = (data) => {
    const template = `<div>
    <p>Oferta de vehículo aprobada para:</p>
    </div>
    <div class="div-table" style="width: 100%;">
        <div class="table" style="display: table;border-collapse: collapse;margin: auto;">
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Modelo</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.model}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Año</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.year}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Placa</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data === null || data === void 0 ? void 0 : data.plate}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Vendedor</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.fullName}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Concesionario</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.concesionary}</div>
        </div>
        <div style=" display: table-row;border: 1px solid #000;">
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#788199">Estado</div>
            <div style="display: table-cell;padding: 8px;border-left: 1px solid #000;background:#b5bac9">${data.city}</div>
        </div>
        </div>
    </div>`;
};
//# sourceMappingURL=templates.mails.js.map