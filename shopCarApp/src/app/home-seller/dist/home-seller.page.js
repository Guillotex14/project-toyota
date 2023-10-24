"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeSellerPage = void 0;
var core_1 = require("@angular/core");
var sellet_1 = require("src/models/sellet");
var states_1 = require("../../assets/json/states");
var HomeSellerPage = /** @class */ (function () {
    function HomeSellerPage(router, utils, menu, sellerSrv, modalCtrl) {
        this.router = router;
        this.utils = utils;
        this.menu = menu;
        this.sellerSrv = sellerSrv;
        this.modalCtrl = modalCtrl;
        this.arrayVehicles = [];
        this.arrayNotifies = [];
        this.notificationById = new sellet_1.NotificationById();
        this.arrayModels = [];
        this.arrayUbication = [];
        this.arrayBrands = [];
        this.minYear = "";
        this.maxYear = "";
        this.minPrice = "";
        this.maxPrice = "";
        this.minKms = "";
        this.maxKms = "";
        this.brand = "";
        this.model = "";
        this.ubication = "";
        this.type_vehicle = "";
        this.minYearAux = "";
        this.maxYearAux = "";
        this.minPriceAux = "";
        this.maxPriceAux = "";
        this.minKmsAux = "";
        this.maxKmsAux = "";
        this.countNotifies = 0;
        this.id_seller = "";
        this.id_user = "";
        this.arrayUbication = states_1.states;
        this.notificationById._id = "";
        this.notificationById.id_user = "";
        this.notificationById.title = "";
        this.notificationById.message = "";
        this.notificationById.date = "";
        this.notificationById.status = false;
        var data = localStorage.getItem('me');
        if (data) {
            var me = JSON.parse(data);
            this.id_seller = me.id_sell;
            this.id_user = me.id;
        }
    }
    HomeSellerPage.prototype.ionViewWillEnter = function () {
        this.getBrands();
        this.getModels();
        this.getNotifies();
        this.getCountNotifies();
        this.getVehicles();
    };
    HomeSellerPage.prototype.ngOnInit = function () {
    };
    HomeSellerPage.prototype.getBrands = function () {
        var _this = this;
        this.sellerSrv.allBrands().subscribe(function (res) {
            _this.arrayBrands = res.data;
        }, function (err) {
            console.log(err);
        });
    };
    HomeSellerPage.prototype.getModels = function () {
        var _this = this;
        this.sellerSrv.allModels().subscribe(function (res) {
            if (res.status) {
                _this.arrayModels = res.data;
            }
            else {
                _this.utils.presentToast(res.message);
            }
        }, function (err) {
            console.log(err);
            _this.utils.presentToast("Error de servidor");
        });
    };
    HomeSellerPage.prototype.getNotifies = function () {
        var _this = this;
        var data = {
            id_user: this.id_user
        };
        this.sellerSrv.getNotifications(data).subscribe(function (data) {
            if (data.status) {
                _this.arrayNotifies = data.data;
            }
        });
    };
    HomeSellerPage.prototype.getCountNotifies = function () {
        var _this = this;
        var data = {
            id_user: this.id_user
        };
        this.sellerSrv.getCountNotifications(data).subscribe(function (data) {
            if (data.status) {
                _this.countNotifies = data.data;
            }
            else {
                _this.countNotifies = 0;
            }
        });
    };
    HomeSellerPage.prototype.goTo = function (route) {
        this.router.navigate([route]);
    };
    HomeSellerPage.prototype.openMenu = function () {
        this.utils.setLogin(true);
        this.menu.open();
    };
    HomeSellerPage.prototype.addVehicle = function () {
        this.router.navigate(['add-vehicle']);
    };
    HomeSellerPage.prototype.goDetail = function (id) {
        this.router.navigate(['car-detail/' + id + '/home-seller']);
    };
    HomeSellerPage.prototype.openModalNotification = function () {
        this.modal.present();
    };
    HomeSellerPage.prototype.openModal = function () {
        this.modalFilter.present();
        this.minYear = "";
        this.maxYear = "";
        this.minPrice = "";
        this.maxPrice = "";
        this.minKms = "";
        this.maxKms = "";
        this.brand = "";
        this.model = "";
        this.ubication = "";
        this.type_vehicle = "";
        this.minYearAux = "";
        this.maxYearAux = "";
        this.minPriceAux = "";
        this.maxPriceAux = "";
        this.minKmsAux = "";
        this.maxKmsAux = "";
    };
    HomeSellerPage.prototype.closeModal = function () {
        this.modal.dismiss();
    };
    HomeSellerPage.prototype.openDetailNotification = function (id) {
        var _this = this;
        var data = {
            id: id
        };
        this.sellerSrv.notificationById(data).subscribe(function (data) {
            if (data.status) {
                _this.notificationById = data.data;
                _this.filterModal.present();
                _this.updateNotification();
            }
        });
    };
    HomeSellerPage.prototype.closeModalDetail = function () {
        if (this.arrayNotifies.length > 0) {
            this.filterModal.dismiss();
        }
        else {
            this.filterModal.dismiss();
            this.modal.dismiss();
        }
    };
    HomeSellerPage.prototype.updateNotification = function () {
        var _this = this;
        var data = {
            id: this.notificationById._id
        };
        this.sellerSrv.updateNotification(data).subscribe(function (data) {
            if (data.status) {
                _this.getNotifies();
                _this.getCountNotifies();
            }
        });
    };
    HomeSellerPage.prototype.dismissModal = function () {
        this.modalFilter.dismiss();
    };
    HomeSellerPage.prototype.applyFilter = function () {
        this.getVehicles();
        this.modalFilter.dismiss();
    };
    HomeSellerPage.prototype.getVehicles = function () {
        var _this = this;
        var data = {
            brand: this.brand,
            model: this.model,
            ubication: this.ubication,
            type_vehicle: this.type_vehicle,
            minYear: parseInt(this.minYear) > 0 ? parseInt(this.minYear) : 0,
            maxYear: parseInt(this.maxYear) > 0 ? parseInt(this.maxYear) : 0,
            minPrice: parseInt(this.minPrice) > 0 ? parseInt(this.minPrice) : 0,
            maxPrice: parseInt(this.maxPrice) > 0 ? parseInt(this.maxPrice) : 0,
            minKm: parseInt(this.minKms) > 0 ? parseInt(this.minKms) : 0,
            maxKm: parseInt(this.maxKms) > 0 ? parseInt(this.maxKms) : 0
        };
        this.utils.presentLoading("Cargando vehículos");
        this.sellerSrv.getListByFilter(data).subscribe(function (data) {
            if (data.status) {
                _this.arrayVehicles = data.data;
                _this.utils.dismissLoading();
            }
            else {
                _this.utils.dismissLoading();
                _this.utils.presentToast(data.message);
            }
        }, function (err) {
            _this.utils.dismissLoading();
            _this.utils.presentToast("Error de servidor");
        });
    };
    HomeSellerPage.prototype.dotMinYear = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.minYearAux = num;
            this.minYear = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    HomeSellerPage.prototype.dotMaxYear = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.maxYearAux = num;
            this.maxYear = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    HomeSellerPage.prototype.dotMinKm = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.minKmsAux = num;
            this.minKms = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    HomeSellerPage.prototype.dotMaxKm = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.maxKmsAux = num;
            this.maxKms = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    HomeSellerPage.prototype.dotMinPrice = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.minPriceAux = num;
            this.minPrice = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    HomeSellerPage.prototype.dotMaxPrice = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.maxPriceAux = num;
            this.maxPrice = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    HomeSellerPage.prototype.deleteArray = function (i) {
        this.arrayVehicles.splice(i, 1);
    };
    __decorate([
        core_1.ViewChild('modalNotifications')
    ], HomeSellerPage.prototype, "modal");
    __decorate([
        core_1.ViewChild('modalDetailNotification')
    ], HomeSellerPage.prototype, "filterModal");
    __decorate([
        core_1.ViewChild('modalFilterHomeSeller')
    ], HomeSellerPage.prototype, "modalFilter");
    HomeSellerPage = __decorate([
        core_1.Component({
            selector: 'app-home-seller',
            templateUrl: './home-seller.page.html',
            styleUrls: ['./home-seller.page.scss']
        })
    ], HomeSellerPage);
    return HomeSellerPage;
}());
exports.HomeSellerPage = HomeSellerPage;
