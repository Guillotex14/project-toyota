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
    }
    SellerService.prototype.addMechanic = function (data) {
        return this.http.post(global.urlBase + 'user/insert', data, this.authSrv.getToken());
    };
    SellerService.prototype.addVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.getMyVehicles = function (id) {
        return this.http.post(global.urlBase + 'vehicle/myVehicles', id, this.authSrv.getToken());
    };
    SellerService.prototype.vehicleById = function (id) {
        return this.http.post(global.urlBase + 'vehicle/vehicleById', id, this.authSrv.getToken());
    };
    SellerService.prototype.mechanicFile = function (id) {
        return this.http.post(global.urlBase + 'vehicle/mechanicalFileByIdVehicle', id, this.authSrv.getToken());
    };
    SellerService.prototype.updateVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/updateVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.getMechanicByConcesionary = function (concesionary) {
        return this.http.post(global.urlBase + 'seller/mechanicByConcesionary', concesionary, this.authSrv.getToken());
    };
    SellerService.prototype.allBrands = function () {
        return this.http.get(global.urlBase + 'vehicle/all-brands?s=', this.authSrv.getToken());
    };
    SellerService.prototype.buyVehicle = function (data) {
        return this.http.post(global.urlBase + 'sale/buyVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.approveBuyVehicle = function (data) {
        return this.http.post(global.urlBase + 'sale/approveBuyVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.rejectBuyVehicle = function (data) {
        return this.http.post(global.urlBase + 'sale/rejectBuyVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.getNotifications = function (data) {
        return this.http.get(global.urlBase + "user/getNotifications?id_user=" + data.id_user + "&pos=" + data.pos + "&lim=" + data.lim, this.authSrv.getToken());
    };
    SellerService.prototype.updateNotification = function (data) {
        return this.http.post(global.urlBase + 'user/updateNotification', data, this.authSrv.getToken());
    };
    SellerService.prototype.getCountNotifications = function (data) {
        return this.http.post(global.urlBase + 'user/countNotifications', data, this.authSrv.getToken());
    };
    SellerService.prototype.notificationById = function (data) {
        return this.http.post(global.urlBase + 'user/notificationById', data, this.authSrv.getToken());
    };
    SellerService.prototype.getListByFilter = function (data) {
        return this.http.post(global.urlBase + 'vehicle/filterVehiclesWithMongo', data, this.authSrv.getToken());
    };
    SellerService.prototype.addImageVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addImgVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.editImageVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/updateImgVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.deleteImageVehicle = function (data) {
        return this.http.post(global.urlBase + 'vehicle/deleteImgVehicle', data, this.authSrv.getToken());
    };
    SellerService.prototype.addImgDoc = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addImgDocuments', data, this.authSrv.getToken());
    };
    SellerService.prototype.deleteImgDoc = function (data) {
        return this.http.post(global.urlBase + 'vehicle/deleteImgDocuments', data, this.authSrv.getToken());
    };
    SellerService.prototype.editImgDoc = function (data) {
        return this.http.post(global.urlBase + 'vehicle/updateImgDocuments', data, this.authSrv.getToken());
    };
    SellerService.prototype.allModels = function () {
        return this.http.get(global.urlBase + 'vehicle/allModelVehicle?s=', this.authSrv.getToken());
    };
    SellerService.prototype.allConcesionaries = function () {
        return this.http.get(global.urlBase + 'vehicle/allConcesionaries', this.authSrv.getToken());
    };
    SellerService.prototype.allStates = function () {
        return this.http.get(global.urlBase + 'vehicle/allStates', this.authSrv.getToken());
    };
    SellerService.prototype.autoComplete = function (data) {
        return this.http.post(global.urlBase + 'vehicle/autocompleteModels', data, this.authSrv.getToken());
    };
    SellerService.prototype.dispatched = function (data) {
        return this.http.post(global.urlBase + 'vehicle/dispatchedCar', data, this.authSrv.getToken());
    };
    SellerService.prototype.repost = function (data) {
        return this.http.post(global.urlBase + 'vehicle/repost', data, this.authSrv.getToken());
    };
    SellerService.prototype.generatePdf = function (data) {
        return this.http.get(global.urlBase + "vehicle/generatePdf?id=" + data.id, this.authSrv.getToken());
    };
    SellerService.prototype.getGrafic = function (data) {
        return this.http.get(global.urlBase + "vehicle/filterGraphySale?month=" + data.month + "&yearSold=" + data.yearSold + "&brandCar=" + data.brandCar + "&modelCar=" + data.modelCar + "&yearCar=" + data.yearCar + "&concesionary=" + data.concesionary + "&rangMonths=" + data.rangMonths + "&triple_m=" + data.triple_m, this.authSrv.getToken());
    };
    SellerService.prototype.getListCars = function (data) {
        return this.http.get(global.urlBase + "vehicle/listVehiclesSale?dateFrom=" + data.dateFrom + "&dateTo=" + data.dateTo + "&yearCar=" + data.yearCar + "&brandCar=" + data.brandCar + "&modelCar=" + data.modelCar + "&concesionary=" + data.concesionary + "&id_user=" + data.id_user, this.authSrv.getToken());
    };
    SellerService.prototype.exportExcel = function (data) {
        return this.http.get(global.urlBase + "vehicle/exportExcell?dateFrom=" + data.dateFrom + "&dateTo=" + data.dateTo + "&yearCar=" + data.yearCar + "&brandCar=" + data.brandCar + "&modelCar=" + data.modelCar + "&concesionary=" + data.concesionary + "&id_user=" + data.id_user, this.authSrv.getToken());
    };
    SellerService.prototype.ofertInfo = function (data) {
        return this.http.get(global.urlBase + "vehicle/ofertInfo?id=" + data, this.authSrv.getToken());
    };
    SellerService.prototype.myOfferts = function (data) {
        return this.http.get(global.urlBase + "vehicle/myOfferts?s=" + data.s + "&brand=" + data.brand + "&model=" + data.model + "&minYear=" + data.minYear + "&maxYear=" + data.maxYear + "&minPrice=" + data.minPrice + "&maxPrice=" + data.maxPrice + "&minKm=" + data.minKm + "&maxKm=" + data.maxKm + "&lim=" + data.lim + "&pos=" + data.pos, this.authSrv.getToken());
    };
    SellerService.prototype.saveCustomer = function (data) {
        return this.http.post(global.urlBase + 'client/add', data, this.authSrv.getToken());
    };
    SellerService.prototype.getCustomers = function () {
        return this.http.get(global.urlBase + "client/all?s=", this.authSrv.getToken());
    };
    SellerService.prototype.getReportList = function (data) {
        var _a;
        return this.http.get(global.urlBase + "vehicle/allRerportMechanicalFile", { params: data, headers: (_a = this.authSrv.getToken()) === null || _a === void 0 ? void 0 : _a.headers });
    };
    SellerService.prototype.addRerport = function (data) {
        return this.http.post(global.urlBase + 'vehicle/addRerportMechanicalFile', data, this.authSrv.getToken());
    };
    SellerService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SellerService);
    return SellerService;
}());
exports.SellerService = SellerService;
