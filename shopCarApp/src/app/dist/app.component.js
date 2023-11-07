"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var camera_1 = require("@capacitor/camera");
var global = require("../models/global");
var AppComponent = /** @class */ (function () {
    function AppComponent(menu, utils, router, platform, authSrv) {
        this.menu = menu;
        this.utils = utils;
        this.router = router;
        this.platform = platform;
        this.authSrv = authSrv;
        this.openASEdit = false;
        this.typeConection = false;
        this.typeUser = "";
        this.username = "";
        this.idUser = "";
        this.image = null;
        this.aux = 0;
        this.url = global.urlImgUser;
        this.actionSheetButtons = [];
        this.actionSheetButtonsEdit = [];
        var data = localStorage.getItem('me');
        // if(data){
        //   let me = JSON.parse(data);
        //   this.username = me.fullName;
        //   this.image = me.img;
        //   this.idUser = me.id;
        //   if(me.type_user == "admin"){
        //     this.router.navigate(['home-admin']);
        //   }else if(me.type_user == "seller"){
        //     this.router.navigate(['seller']);
        //   }else if(me.type_user == "mechanic"){
        //     this.router.navigate(['mechanic']);
        //   }
        // }
        if (this.utils.isApp()) {
            this.typeConection = true;
        }
        this.getLogin();
        this.buttonsActionSheet();
        this.buttonsActionSheetEdit();
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.closeMenu = function () {
        this.menu.close();
    };
    AppComponent.prototype.getLogin = function () {
        var _this = this;
        this.utils.getLogin().subscribe(function (data) {
            if (data === true) {
                var me = localStorage.getItem('me');
                var meJson = JSON.parse(me);
                _this.username = meJson.fullName;
                _this.image = meJson.img;
                _this.idUser = meJson.id;
                _this.typeUser = meJson.type_user;
            }
            else {
                _this.username = "";
                _this.image = null;
                _this.idUser = "";
                _this.typeUser = "";
            }
        });
    };
    AppComponent.prototype.goTo = function (route) {
        this.router.navigate([route]);
        this.menu.close();
    };
    AppComponent.prototype.logout = function () {
        this.utils.setLogin(false);
        localStorage.removeItem('typeUser');
        localStorage.removeItem('me');
        this.router.navigate(['login']);
        this.menu.close();
    };
    AppComponent.prototype.updateImage = function () {
    };
    AppComponent.prototype.buttonsActionSheet = function () {
        var _this = this;
        this.actionSheetButtons = [
            {
                text: 'Cámara',
                icon: 'camera',
                handler: function () {
                    _this.takePhoto();
                }
            },
            {
                text: 'Galería',
                icon: 'image',
                handler: function () {
                    _this.takePhotoGalery();
                }
            },
            {
                text: 'Cancelar',
                icon: 'close',
                role: 'cancel'
            }
        ];
    };
    AppComponent.prototype.buttonsActionSheetEdit = function () {
        var _this = this;
        this.actionSheetButtonsEdit = [
            {
                text: 'Cámara',
                icon: 'camera',
                handler: function () {
                    _this.editTakePhoto();
                }
            },
            {
                text: 'Galería',
                icon: 'image',
                handler: function () {
                    _this.editTakePhotoGalery();
                }
            },
            {
                text: 'Salir',
                icon: 'close',
                role: 'cancel'
            }
        ];
    };
    AppComponent.prototype.saveImageDB = function (img) {
        var _this = this;
        var data = {
            id_user: this.idUser,
            image: img
        };
        var dataMe = localStorage.getItem('me');
        var me = JSON.parse(dataMe);
        this.authSrv.addImage(data).subscribe(function (data) {
            if (data.status) {
                _this.image = data.data;
                _this.utils.dismissLoading();
                _this.utils.presentToast(data.message);
                me = __assign(__assign({}, me), { img: data.data });
                _this.authSrv.saveData(me);
            }
            else {
                _this.utils.dismissLoading();
                _this.utils.presentToast(data.message);
            }
        }, function (error) {
            _this.utils.dismissLoading();
            _this.utils.presentToast("Error al subir la imagen");
        });
    };
    AppComponent.prototype.updateImgDB = function (img) {
        var _this = this;
        var data = {
            id_user: this.idUser,
            image: img,
            public_id: this.image.public_id
        };
        var dataMe = localStorage.getItem('me');
        var me = JSON.parse(dataMe);
        this.authSrv.UpdateImage(data).subscribe(function (data) {
            if (data.status) {
                _this.image = data.data;
                _this.utils.dismissLoading();
                _this.utils.presentToast(data.message);
                me = __assign(__assign({}, me), { img: data.data });
                _this.authSrv.saveData(me);
            }
            else {
                _this.utils.dismissLoading();
                _this.utils.presentToast(data.message);
            }
        }, function (error) {
            _this.utils.dismissLoading();
            _this.utils.presentToast("Error al subir la imagen");
        });
    };
    AppComponent.prototype.addImage = function () {
        this.fileInput.nativeElement.click();
    };
    AppComponent.prototype.getImage = function (file) {
        var _this = this;
        this.utils.presentLoading("Cargando imagen...");
        var reader = new FileReader();
        reader.onload = function (e) {
            var info = e.target["result"];
            var split = info.split("base64");
            var split2 = split[0].split("/");
            var type = split2[1];
            _this.saveImageDB(info);
        };
        reader.readAsDataURL(file[0]);
    };
    AppComponent.prototype.getImage2 = function (file) {
        var _this = this;
        this.utils.presentLoading("Cargando imagen...");
        var reader = new FileReader();
        reader.onload = function (e) {
            var info = e.target["result"];
            var split = info.split("base64");
            var split2 = split[0].split("/");
            var type = split2[1];
            _this.updateImgDB(info);
        };
        reader.readAsDataURL(file[0]);
    };
    AppComponent.prototype.editImage = function () {
        this.fileInput2.nativeElement.click();
    };
    AppComponent.prototype.takePhoto = function () {
        return __awaiter(this, void 0, void 0, function () {
            var camera;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.utils.presentLoading("Cargando imagen...");
                        return [4 /*yield*/, camera_1.Camera.getPhoto({
                                quality: 90,
                                allowEditing: false,
                                resultType: camera_1.CameraResultType.DataUrl,
                                source: camera_1.CameraSource.Camera
                            }).then(function (imageData) {
                                _this.saveImageDB(imageData.dataUrl);
                            })];
                    case 1:
                        camera = _a.sent();
                        this.utils.dismissLoading();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.takePhotoGalery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var camera;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.utils.presentLoading("Cargando imagen...");
                        return [4 /*yield*/, camera_1.Camera.getPhoto({
                                quality: 90,
                                allowEditing: false,
                                resultType: camera_1.CameraResultType.DataUrl,
                                source: camera_1.CameraSource.Photos
                            }).then(function (imageData) {
                                _this.saveImageDB(imageData.dataUrl);
                            }, function (err) {
                                console.log(err);
                            })];
                    case 1:
                        camera = _a.sent();
                        this.utils.dismissLoading();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.editTakePhoto = function () {
        return __awaiter(this, void 0, void 0, function () {
            var camera;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, camera_1.Camera.getPhoto({
                            quality: 90,
                            allowEditing: false,
                            resultType: camera_1.CameraResultType.DataUrl,
                            source: camera_1.CameraSource.Camera
                        }).then(function (imageData) {
                            _this.updateImgDB(imageData.dataUrl);
                        }, function (err) {
                            console.log(err);
                        })];
                    case 1:
                        camera = _a.sent();
                        this.utils.dismissLoading();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.editTakePhotoGalery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var camera;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.utils.presentLoading("Cargando imagen...");
                        return [4 /*yield*/, camera_1.Camera.getPhoto({
                                quality: 90,
                                allowEditing: false,
                                resultType: camera_1.CameraResultType.DataUrl,
                                source: camera_1.CameraSource.Photos
                            }).then(function (imageData) {
                                _this.updateImgDB(imageData.dataUrl);
                            }, function (err) {
                                console.log(err);
                            })];
                    case 1:
                        camera = _a.sent();
                        this.utils.dismissLoading();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.openActionSheet = function () {
        this.actionSheet.present();
        this.closeMenu();
    };
    AppComponent.prototype.openActionSheetEdit = function () {
        this.actionSheetEdit.present();
        this.closeMenu();
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], AppComponent.prototype, "fileInput");
    __decorate([
        core_1.ViewChild('fileInput2')
    ], AppComponent.prototype, "fileInput2");
    __decorate([
        core_1.ViewChild('ActionSheet')
    ], AppComponent.prototype, "actionSheet");
    __decorate([
        core_1.ViewChild('ActionSheetEdit')
    ], AppComponent.prototype, "actionSheetEdit");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
