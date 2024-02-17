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
        case "mechanicalFile":
            templat = mechanicalFile(data);
            break;
        default:
            break;
    }
    return templat;
};
exports.templatesMails = templatesMails;
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
    return template;
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
    return template;
};
const newInspect = (data) => {
    const template = `<div>
    <p>Nueva inspeccion para:</p>
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
    return template;
};
const mechanicalFile = (data) => {
    const template = `<div>
    <p>Hola ${data.fullname}</p>
    <p>
        A traves de este correo adjuntamos la ficha tecnica del vehiculo ${data.model} año ${data.year} ubicado en ${data.city}, si no se visualiza el archivo adjunto puedes visualizarlo dando click en el siguiente enlace:
    </p>

    <div style="display: block;">
        <div style="width: 300px;margin: auto;">
            <p>
                <a 
                href="${data.url}" 
                style="box-sizing: border-box;
                font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                border-radius: 4px;
                color: #fff;
                display: inline-block;
                overflow: hidden;
                text-decoration: none;
                background-color: #EB0A1E;
                border-bottom: 8px solid #EB0A1E;
                border-left: 18px solid #EB0A1E;
                border-right: 18px solid #EB0A1E;
                border-top: 8px solid #EB0A1E;"
                >Ver ficha técnica</a>
            </p>
        </div>
    </div>

</div>`;
    return template;
};
//# sourceMappingURL=templates.mails.js.map