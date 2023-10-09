export function templatesMails( template: any, data: any){
    let templat: any = "";
    
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


const ofertBuyCar = (data:any) => {

    const template = "";  


    return template
}

const ofertApprove=  (data:any) => {
    
}

const ofertReject=  (data:any) => {
    
}

const newInspect=  (data:any) => {
    
}

const mechanicalFileApprove=  (data:any) => {
    
}

const mechanicalFileReject=  (data:any) => {
    
}


