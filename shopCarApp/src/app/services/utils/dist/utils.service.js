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
exports.UtilsService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var UtilsService = /** @class */ (function () {
    function UtilsService(toastController, loadingCtrl, toastCtrl, loadCtrl, alertController, platform) {
        this.toastController = toastController;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.loadCtrl = loadCtrl;
        this.alertController = alertController;
        this.platform = platform;
        this.isLoged = new rxjs_1.Subject();
        this.isLogin = new rxjs_1.Subject();
    }
    UtilsService.prototype.getOnLoged = function () {
        return this.isLoged;
    };
    Object.defineProperty(UtilsService.prototype, "onLoged", {
        get: function () {
            return this.isLoged;
        },
        enumerable: false,
        configurable: true
    });
    UtilsService.prototype.setOnLoged = function (value) {
        this.isLoged.next(value);
    };
    UtilsService.prototype.getLogin = function () {
        return this.isLogin.asObservable();
    };
    UtilsService.prototype.setLogin = function (value) {
        this.isLogin.next(value);
    };
    UtilsService.prototype.showLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingCtrl.create({
                                message: 'Cargando',
                                duration: 5000
                            })];
                    case 1:
                        _a.loading = _b.sent();
                        return [4 /*yield*/, this.loading.present()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    UtilsService.prototype.dismissLoading2 = function () {
        this.loading.dismiss();
    };
    //////************ plataforma ***********/////
    UtilsService.prototype.isApp = function () {
        var is = false;
        if (this.platform.is("mobile") &&
            this.platform.is("cordova") &&
            (this.platform.is("ios") || this.platform.is("android"))) {
            is = true;
        }
        return is;
    };
    /////***************** servicio de alertas  ****************/
    UtilsService.prototype.presentToast = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: message,
                            duration: 2000,
                            position: 'top',
                            color: 'dark'
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    UtilsService.prototype.presentLoading = function (message, duration) {
        if (duration === void 0) { duration = 1000; }
        return __awaiter(this, void 0, void 0, function () {
            var loading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadCtrl.create({
                            message: message,
                            spinner: 'bubbles',
                            duration: duration
                        })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UtilsService.prototype.dismissLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.loadCtrl.dismiss()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 2000);
                return [2 /*return*/];
            });
        });
    };
    UtilsService.prototype.presentAlertConfirm = function (message, header) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: header,
                            message: message,
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel'
                                },
                                {
                                    text: 'Aceptar',
                                    handler: function () {
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UtilsService.prototype.presentAlert = function (message, header, subHeader) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: header,
                            subHeader: subHeader,
                            message: message,
                            buttons: ['Aceptar']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UtilsService.prototype.presentAlertComment = function (message, header, subHeader) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: "",
                            subHeader: subHeader,
                            message: message,
                            inputs: [
                                {
                                    type: 'textarea',
                                    placeholder: 'Comentario'
                                },
                            ],
                            buttons: ['Aceptar']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UtilsService.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    ////************************* servicio de comparacion ***************************////
    UtilsService.prototype.addComparasion = function (data) {
        var comparasion = JSON.parse(localStorage.getItem('comparasion'));
        if (comparasion != null && comparasion.length == 4) {
            this.presentAlert('Solo se pueden añadir 4 vehículos a la comparación', 'Comparación', '');
            return;
        }
        if (comparasion == null) {
            localStorage.setItem('comparasion', JSON.stringify([data]));
        }
        else {
            var index = comparasion.find(function (item) { return item._id == data._id; });
            if (!index) {
                comparasion.push(data);
                localStorage.setItem('comparasion', JSON.stringify(comparasion));
                // this.presentToast('Vehiculo agregado a la comparacion');
                this.presentAlert('Vehículo agregado a la comparación', 'Comparación', '');
            }
            else {
                // this.presentToast('El vehiculo ya esta en la comparacion');
                this.presentAlert('El vehículo se encuentra en comparación', 'Comparación');
            }
        }
    };
    UtilsService.prototype.getComparasion = function () {
        var comparasion = JSON.parse(localStorage.getItem('comparasion'));
        return comparasion;
    };
    UtilsService.prototype.deleteComparasion = function (id) {
        var comparasion = JSON.parse(localStorage.getItem('comparasion'));
        var index = comparasion.findIndex(function (item) { return item.id == id; });
        comparasion.splice(index, 1);
        localStorage.setItem('comparasion', JSON.stringify(comparasion));
    };
    UtilsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UtilsService);
    return UtilsService;
}());
exports.UtilsService = UtilsService;
