export function templatesNotifies(template: any, data: any) {
    let templat: any = "";
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


const ofertBuyCar = async (data: any) => {

}

const ofertApprove = async (data: any) => {

}

const ofertReject = async (data: any) => {

}

const newInspect = async (data: any) => {

}

const mechanicalFileApprove = async (data: any) => {

}

const mechanicalFileReject = async (data: any) => {

}

const add_request_models_brands = (data?: any) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud para agregar marca: ${data.branch} y modelo:${data.model}`
    } else if (data.model) {
        message = `Solidud para agregar el modelo: ${data.model}`

    } else if (data.branch) {
        message = `Solidud para agregar la marca: ${data.model}`

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
}

const approve_request_models_brands = (data?: any) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud aprobada para la marca: ${data.branch} y modelo:${data.model}`
    } else if (data.model) {
        message = `Solidud aprobada para el modelo: ${data.model}`

    } else if (data.branch) {
        message = `Solidud aprobada para la marca: ${data.model}`

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
}

const success_request_models_brands = (data?: any) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud agregada para la marca: ${data.branch} y modelo:${data.model} con exito`
    } else if (data.model) {
        message = `Solidud agregada para el modelo: ${data.model} con exito`

    } else if (data.branch) {
        message = `Solidud agregada para la marca: ${data.model} con exito`
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
}

const cancel_request_models_brands = (data?: any) => {
    let message = "";
    if (data.model && data.branch) {
        message = `Solidud cancelada para la marca: ${data.branch} y modelo:${data.model} con exito`
    } else if (data.model) {
        message = `Solidud cancelada para el modelo: ${data.model} con exito`

    } else if (data.branch) {
        message = `Solidud cancelada para la marca: ${data.model} con exito`
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
}


