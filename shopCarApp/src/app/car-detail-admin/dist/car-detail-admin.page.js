"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CarDetailAdminPage = void 0;
var core_1 = require("@angular/core");
var sellet_1 = require("src/models/sellet");
var global = require("../../models/global");
var CarDetailAdminPage = /** @class */ (function () {
    function CarDetailAdminPage(router, menu, utils, actRoute, sellerSrv, adminSrv) {
        this.router = router;
        this.menu = menu;
        this.utils = utils;
        this.actRoute = actRoute;
        this.sellerSrv = sellerSrv;
        this.adminSrv = adminSrv;
        this.id = "";
        this.urlImg = global.urlImgvehicles;
        this.theRoute = "";
        this.carDetail = new sellet_1.CarDetailSeller();
        this.id = this.actRoute.snapshot.params['id'];
        this.theRoute = this.actRoute.snapshot.params['route'];
        this.carDetail.images = [];
        this.carDetail.imgs_documentation = [];
        this.carDetail.concesionary_maintenance = false;
    }
    CarDetailAdminPage.prototype.ngOnInit = function () {
    };
    CarDetailAdminPage.prototype.ionViewWillEnter = function () {
        this.getVehicleById();
    };
    CarDetailAdminPage.prototype.goBack = function () {
        if (this.theRoute === "home-admin") {
            this.router.navigate(['home-admin']);
        }
        else if (this.theRoute === "graphics-admin") {
            this.router.navigate(['graphics-admin']);
        }
    };
    CarDetailAdminPage.prototype.openMenu = function () {
        this.utils.setLogin(true);
        this.menu.open();
    };
    CarDetailAdminPage.prototype.getVehicleById = function () {
        var _this = this;
        var data = {
            id: this.id
        };
        this.utils.presentLoading("Cargando...");
        this.adminSrv.getVehicleById(data).subscribe(function (data) {
            if (data.status) {
                _this.carDetail = data.data;
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
    CarDetailAdminPage.prototype.openFile = function () {
        this.router.navigate(['mechanical-file-detail-admin/' + this.id + '/' + this.theRoute]);
    };
    CarDetailAdminPage.prototype.setDot = function (numb) {
        if (numb == null) {
            return "0";
        }
        else {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join(".");
        }
    };
    CarDetailAdminPage.prototype.share = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                this.utils.presentLoading("Generando PDF...");
                data = {
                    id: this.id
                };
                this.sellerSrv.generatePdf(data).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (res.status) {
                            this.utils.dismissLoading();
                            // await Share.share({
                            //   title: 'Vehiculo compartido',
                            //   text: 'Visualiza las Caracteristicas del vehiculo que te comparto',
                            //   url: res.data
                            // });
                        }
                        return [2 /*return*/];
                    });
                }); }, function (error) {
                    console.log(error);
                });
                return [2 /*return*/];
            });
        });
    };
    CarDetailAdminPage = __decorate([
        core_1.Component({
            selector: 'app-car-detail-admin',
            templateUrl: './car-detail-admin.page.html',
            styleUrls: ['./car-detail-admin.page.scss']
        })
    ], CarDetailAdminPage);
    return CarDetailAdminPage;
}());
exports.CarDetailAdminPage = CarDetailAdminPage;
