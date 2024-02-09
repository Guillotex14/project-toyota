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
exports.GraphicsAdminPage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var chart_js_1 = require("chart.js");
var moment = require("moment");
var concesionaries_1 = require("src/assets/json/concesionaries");
var browser_1 = require("@capacitor/browser");
moment;
var GraphicsAdminPage = /** @class */ (function () {
    function GraphicsAdminPage(router, menu, utils, sellerSrv, platform, adminSrv) {
        this.router = router;
        this.menu = menu;
        this.utils = utils;
        this.sellerSrv = sellerSrv;
        this.platform = platform;
        this.adminSrv = adminSrv;
        this.today = new Date();
        this.month = 1;
        this.yearSold = '';
        this.yearSoldAux = '';
        this.rangMonths = "12";
        this.yearCar = '';
        this.yearCarAux = '';
        this.brandCar = '';
        this.modelCar = '';
        this.triple_m = '';
        //data filter 2
        this.dateTo = '';
        this.dateFrom = '';
        this.yearCar2 = '';
        this.yearCarAux2 = '';
        this.brandCar2 = '';
        this.modelCar2 = '';
        this.concesionary2 = '';
        this.concesionary = '';
        this.id_user = '';
        this.arrayLabels = [];
        this.arrayBrands = [];
        this.arrayModels = [];
        this.carListGraphic = [];
        this.arrayData = {};
        this.dataGraphy = {};
        this.arrayListCars = [];
        this.arrayConcesionary = [];
        //breadcrumb
        this.brand_breadcrumb = "";
        this.model_breadcrumb = "";
        this.year_breadcrumb = "";
        this.rangMonths_breadcrumb = "";
        this.month_breadcrumb = "";
        this.triple_m_breadcrumb = "";
        this.typeUser = 'admin';
        this.loading = true;
        this.data = {};
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.arrayConcesionary = concesionaries_1.concesionaries;
        this.data = JSON.parse(localStorage.getItem('me'));
        if (this.data) {
            this.id_user = this.data.id;
            this.typeUser = this.data.type_user;
        }
        if (this.data.type_user == "admin_concesionary") {
            this.concesionary = this.data.concesionary;
            this.concesionary2 = this.data.concesionary;
        }
    }
    GraphicsAdminPage.prototype.ngAfterViewInit = function () {
        this.getChartGrafic();
        this.getBrands();
        this.getModels();
        this.getCarList();
    };
    GraphicsAdminPage.prototype.goBack = function () {
        this.router.navigate(['home-admin']);
    };
    GraphicsAdminPage.prototype.openMenu = function () {
        this.utils.setLogin(true);
        this.menu.open();
    };
    GraphicsAdminPage.prototype.getBrands = function () {
        var _this = this;
        this.adminSrv.allBrands().subscribe(function (res) {
            if (res.status) {
                _this.loading = false;
                _this.arrayBrands = res.data;
            }
            else {
                _this.utils.presentToast(res.message);
            }
        }, function (err) {
            _this.utils.presentToast("Error de servidor");
        });
    };
    GraphicsAdminPage.prototype.getModels = function () {
        var _this = this;
        this.adminSrv.allModels().subscribe(function (res) {
            if (res.status) {
                _this.loading = false;
                _this.arrayModels = res.data;
            }
        }, function (err) {
            console.log(err);
        });
    };
    GraphicsAdminPage.prototype.openFile = function () {
        this.router.navigate(['mechanical-file']);
    };
    GraphicsAdminPage.prototype.lineChartMethod = function () {
        this.lineChart = new chart_js_1.Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: this.dataGraphy,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                // Redondear el valor numérico al entero más cercano
                                var value = Math.round(tooltipItem.yLabel);
                                return value.toString(); // Devolver el valor redondeado sin decimales
                            }
                        }
                    }
                }
            }
        });
    };
    GraphicsAdminPage.prototype.getChartGrafic = function (formFilter) {
        var _this = this;
        var data = {
            month: this.month,
            yearSold: this.yearSold,
            rangMonths: this.rangMonths,
            yearCar: this.yearCar,
            brandCar: this.brandCar,
            modelCar: this.modelCar,
            concesionary: this.concesionary2,
            triple_m: this.triple_m
        };
        this.utils.presentLoading("Cargando datos...", 500);
        this.sellerSrv.getGrafic(data).subscribe(function (res) {
            if (res.status) {
                _this.loading = false;
                _this.utils.dismissLoading();
                _this.arrayLabels = res.data.labels;
                _this.arrayData = res.data.datasets[0];
                _this.dataGraphy = res.data;
                _this.lineChartMethod();
                var emptyGraphy = 0;
                for (var i = 0; i < _this.dataGraphy.datasets[0].data.length; i++) {
                    var element = _this.dataGraphy.datasets[0].data[i];
                    if (element == 0) {
                        emptyGraphy++;
                    }
                }
                if (formFilter) {
                    if (emptyGraphy == _this.dataGraphy.datasets[0].data.length) {
                        _this.utils.presentAlert("", "Gráfica sin resultado", "");
                    }
                }
                if (res.data.list.length > 0) {
                    _this.carListGraphic = res.data.list;
                }
                else {
                    _this.month = 1;
                    _this.yearSold = "";
                    _this.yearSoldAux = "";
                    _this.rangMonths = "12";
                    _this.yearCar = "";
                    _this.brandCar = "";
                    _this.modelCar = "";
                    _this.concesionary2 = "";
                }
            }
            else {
                _this.utils.dismissLoading();
                _this.utils.presentToast(res.message);
            }
        }, function (err) {
            console.log(err);
            _this.utils.dismissLoading();
            _this.utils.presentToast("Error de servidor");
        });
    };
    GraphicsAdminPage.prototype.getCarList = function () {
        var _this = this;
        var data = {
            dateTo: this.dateTo,
            dateFrom: this.dateFrom,
            yearCar: this.yearCar2,
            brandCar: this.brandCar2,
            modelCar: this.modelCar2,
            concesionary: this.concesionary2,
            id_user: this.id_user
        };
        this.sellerSrv.getListCars(data).subscribe(function (res) {
            if (res.status) {
                _this.loading = false;
                if (res.data.grupocard.length > 0) {
                    _this.arrayListCars = res.data.grupocard;
                }
                else {
                    _this.dateTo = "";
                    _this.dateFrom = "";
                    _this.yearCar2 = "";
                    _this.yearCarAux2 = "";
                    _this.brandCar2 = "";
                    _this.modelCar2 = "";
                    _this.concesionary2 = "";
                    _this.arrayListCars = [];
                    _this.utils.presentAlert("", "Lista sin resultado", "");
                }
            }
            else {
                _this.utils.presentToast(res.message);
            }
        }, function (err) {
            _this.utils.presentToast("Error de servidor");
        });
    };
    GraphicsAdminPage.prototype.exportExcel = function () {
        var _this = this;
        var data = {
            dateTo: this.dateTo,
            dateFrom: this.dateFrom,
            yearCar: this.yearCar2,
            brandCar: this.brandCar2,
            modelCar: this.modelCar2,
            concesionary: this.concesionary2,
            id_user: this.id_user
        };
        this.utils.showLoading().then(function (_) {
            _this.sellerSrv.exportExcel(data).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.utils.dismissLoading2();
                    if (res.status) {
                        this.descargarArchivo(res.data.fileName, res.data.base64Data);
                        this.utils.presentToast('Se mandado un correo de la exportación del excel ' + res.data.fileName);
                        // this.platform.ready().then(async (d) => {
                        //   if (this.platform.is('mobile')) {
                        //     const directorioDescargas = await Filesystem.getUri({
                        //       directory: Directory.External,
                        //       path: res.data.fileName,
                        //     });
                        //     const rutaArchivo = directorioDescargas.uri;
                        //     try {
                        //       await Filesystem.mkdir({
                        //         path: rutaArchivo, // Ruta de la carpeta donde se guardará el archivo
                        //         directory: Directory.External,
                        //         recursive: true, // Crea la carpeta de forma recursiva si no existe
                        //       });
                        //       await Filesystem.writeFile({
                        //         path: `${rutaArchivo}/${res.data.fileName}`, // Ruta completa del archivo
                        //         data: res.data.base64Data, // Contenido del archivo en base64
                        //         directory: Directory.External,
                        //       });
                        //       this.utils.presentToast(
                        //         'Archivo PDF guardado con éxito en esta ruta: ' +
                        //           rutaArchivo
                        //       );
                        //     } catch (error) {
                        //       this.utils.presentToast(
                        //         'Error al descargar el archivo: ' + error
                        //       );
                        //       console.error('Error al descargar el archivo:', error);
                        //     }
                        //   } else {
                        //     const downloadLink = document.createElement('a');
                        //     downloadLink.href = res.data.base64Data;
                        //     downloadLink.download = res.data.fileName;
                        //     downloadLink.click();
                        //   }
                        // });
                        this.utils.presentToast('Se mandado un correo de la exportación del excel ' + res.data.fileName);
                    }
                    return [2 /*return*/];
                });
            }); }, function (err) {
                console.log(err);
            });
        });
    };
    GraphicsAdminPage.prototype.descargarArchivo = function (nombreArchivo, dataBase64) {
        return __awaiter(this, void 0, Promise, function () {
            var url, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = dataBase64;
                        return [4 /*yield*/, browser_1.Browser.open({ url: url })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error al descargar el archivo:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GraphicsAdminPage.prototype.openModal = function () {
        this.modalFilter.present();
    };
    GraphicsAdminPage.prototype.closeModal = function () {
        this.modalFilter.dismiss();
    };
    GraphicsAdminPage.prototype.applyFilter = function () {
        if (this.lineChart) {
            this.lineChart.destroy();
        }
        this.getChartGrafic(true);
        this.modal.dismiss();
    };
    GraphicsAdminPage.prototype.openModalVehicle = function () {
        this.modalVehicle.present();
    };
    GraphicsAdminPage.prototype.closeModal2 = function () {
        this.modalVehicle.dismiss();
    };
    GraphicsAdminPage.prototype.applyFilter2 = function () {
        this.getCarList();
        this.modalVehicle.dismiss();
    };
    GraphicsAdminPage.prototype.dotMinYear = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num
                .toString()
                .split('')
                .reverse()
                .join('')
                .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.yearCarAux = num;
            this.yearCar = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    GraphicsAdminPage.prototype.dotMinYearSold = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num
                .toString()
                .split('')
                .reverse()
                .join('')
                .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.yearSoldAux = num;
            this.yearSold = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    GraphicsAdminPage.prototype.dotMinYear2 = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num
                .toString()
                .split('')
                .reverse()
                .join('')
                .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.yearCarAux2 = num;
            this.yearCar2 = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    GraphicsAdminPage.prototype.detailCar = function (id) {
        this.router.navigate(['car-detail-admin/' + id + '/graphics-admin']);
    };
    GraphicsAdminPage.prototype.onDateFromChange = function (event) {
        this.dateFrom = moment(event.detail.value).format('YYYY-MM-DD');
    };
    GraphicsAdminPage.prototype.onDateToChange = function (event) {
        this.dateTo = moment(event.detail.value).format('YYYY-MM-DD');
    };
    GraphicsAdminPage.prototype.setDot = function (data) {
        var str = data.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return str.join(".");
    };
    GraphicsAdminPage.prototype.onChangeBrand = function (event) {
        this.brand_breadcrumb = event.detail.value;
    };
    GraphicsAdminPage.prototype.onChangeModel = function (event) {
        this.model_breadcrumb = event.detail.value;
    };
    GraphicsAdminPage.prototype.onInputYear = function (event) {
        this.year_breadcrumb = event.detail.value;
    };
    GraphicsAdminPage.prototype.onChangeRngMonth = function (event) {
        this.rangMonths_breadcrumb = event.detail.value;
    };
    GraphicsAdminPage.prototype.onChangeMonth = function (event) {
        this.month_breadcrumb = event.detail.value;
    };
    GraphicsAdminPage.prototype.onChangeTripleM = function (event) {
        this.triple_m_breadcrumb = event.detail.value;
    };
    __decorate([
        core_1.ViewChild(angular_1.IonModal)
    ], GraphicsAdminPage.prototype, "modal");
    __decorate([
        core_1.ViewChild('ModalFilterGraphicAdmin')
    ], GraphicsAdminPage.prototype, "modalFilter");
    __decorate([
        core_1.ViewChild('ModalFilterVehicleAdmin')
    ], GraphicsAdminPage.prototype, "modalVehicle");
    __decorate([
        core_1.ViewChild('lineCanvas')
    ], GraphicsAdminPage.prototype, "lineCanvas");
    GraphicsAdminPage = __decorate([
        core_1.Component({
            selector: 'app-graphics-admin',
            templateUrl: './graphics-admin.page.html',
            styleUrls: ['./graphics-admin.page.scss']
        })
    ], GraphicsAdminPage);
    return GraphicsAdminPage;
}());
exports.GraphicsAdminPage = GraphicsAdminPage;
