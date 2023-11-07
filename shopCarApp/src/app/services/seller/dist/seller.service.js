"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SellerService = void 0;
var core_1 = require("@angular/core");
var global = require("../../../models/global");
var SellerService = /** @class */ (function () {
    function SellerService(http, authSrv) {
        this.http = http;
        this.authSrv = authSrv;
        this.authToken = "";
        this.authToken = this.authSrv.getToken();
    }
    SellerService.prototype.addMechanic = function (data) {
        return this.http.post(global.urlBase + 'user/insert', data, this.authToken);
    };
    SellerService.prototype.addVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addVehicle', data, this.authToken);
    };
    SellerService.prototype.getMyVehicles = function (id) {
        return this.http.post(global.urlBase + 'vehicle/myVehicles', id, this.authToken);
    };
    SellerService.prototype.vehicleById = function (id) {
        return this.http.post(global.urlBase + 'vehicle/vehicleById', id, this.authToken);
    };
    SellerService.prototype.mechanicFile = function (id) {
        return this.http.post(global.urlBase + 'vehicle/mechanicalFileByIdVehicle', id, this.authToken);
    };
    SellerService.prototype.updateVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/updateVehicle', data, this.authToken);
    };
    SellerService.prototype.getMechanicByConcesionary = function (concesionary) {
        return this.http.post(global.urlBase + 'seller/mechanicByConcesionary', concesionary, this.authToken);
    };
    SellerService.prototype.allBrands = function () {
        return this.http.get(global.urlBase + 'vehicle/all-brands?s=', this.authToken);
    };
    SellerService.prototype.buyVehicle = function (data) {
        return this.http.post(global.urlBase + 'sale/buyVehicle', data, this.authToken);
    };
    SellerService.prototype.approveBuyVehicle = function (data) {
        return this.http.post(global.urlBase + 'sale/approveBuyVehicle', data, this.authToken);
    };
    SellerService.prototype.rejectBuyVehicle = function (data) {
        return this.http.post(global.urlBase + 'sale/rejectBuyVehicle', data, this.authToken);
    };
    SellerService.prototype.getNotifications = function (data) {
        return this.http.get(global.urlBase + "user/getNotifications?id_user=" + data.id_user + "&pos=" + data.pos + "&lim=" + data.lim, this.authToken);
    };
    SellerService.prototype.updateNotification = function (data) {
        return this.http.post(global.urlBase + 'user/updateNotification', data, this.authToken);
    };
    SellerService.prototype.getCountNotifications = function (data) {
        return this.http.post(global.urlBase + 'user/countNotifications', data, this.authToken);
    };
    SellerService.prototype.notificationById = function (data) {
        return this.http.post(global.urlBase + 'user/notificationById', data, this.authToken);
    };
    SellerService.prototype.getListByFilter = function (data) {
        return this.http.post(global.urlBase + 'vehicle/filterVehiclesWithMongo', data, this.authToken);
    };
    SellerService.prototype.addImageVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addImgVehicle', data, this.authToken);
    };
    SellerService.prototype.editImageVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/updateImgVehicle', data, this.authToken);
    };
    SellerService.prototype.deleteImageVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/deleteImgVehicle', data, this.authToken);
    };
    SellerService.prototype.addImgDoc = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addImgDocuments', data, this.authToken);
    };
    SellerService.prototype.deleteImgDoc = function (data) {
        return this.http.post(global.urlBase + 'vehicle/deleteImgDocuments', data, this.authToken);
    };
    SellerService.prototype.editImgDoc = function (data) {
        return this.http.post(global.urlBase + 'vehicle/updateImgDocuments', data, this.authToken);
    };
    SellerService.prototype.allModels = function () {
        return this.http.get(global.urlBase + 'vehicle/allModelVehicle', this.authToken);
    };
    SellerService.prototype.autoComplete = function (data) {
        return this.http.post(global.urlBase + 'vehicle/autocompleteModels', data, this.authToken);
    };
    SellerService.prototype.dispatched = function (data) {
        return this.http.post(global.urlBase + 'vehicle/dispatchedCar', data, this.authToken);
    };
    SellerService.prototype.repost = function (data) {
        return this.http.post(global.urlBase + 'vehicle/repost', data, this.authToken);
    };
    SellerService.prototype.getGrafic = function (data) {
        return this.http.get(global.urlBase + "vehicle/filterGraphySale?month=" + data.month + "&yearSold=" + data.yearSold + "&brandCar=" + data.brandCar + "&modelCar=" + data.modelCar + "&yearCar=" + data.yearCar + "&concesionary=" + data.concesionary + "&rangMonths=" + data.rangMonths + "&triple_m=" + data.triple_m, this.authToken);
    };
    SellerService.prototype.getListCars = function (data) {
        return this.http.get(global.urlBase + "vehicle/listVehiclesSale?dateFrom=" + data.dateFrom + "&dateTo=" + data.dateTo + "&yearCar=" + data.yearCar + "&brandCar=" + data.brandCar + "&modelCar=" + data.modelCar + "&concesionary=" + data.concesionary + "&id_user=" + data.id_user, this.authToken);
    };
    SellerService.prototype.exportExcel = function (data) {
        return this.http.get(global.urlBase + "vehicle/exportExcell?dateFrom=" + data.dateFrom + "&dateTo=" + data.dateTo + "&yearCar=" + data.yearCar + "&brandCar=" + data.brandCar + "&modelCar=" + data.modelCar + "&concesionary=" + data.concesionary + "&id_user=" + data.id_user, this.authToken);
    };
    SellerService.prototype.ofertInfo = function (data) {
        return this.http.get(global.urlBase + "vehicle/ofertInfo?id=" + data, this.authToken);
    };
    SellerService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SellerService);
    return SellerService;
}());
exports.SellerService = SellerService;
