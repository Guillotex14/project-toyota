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
exports.GraphicsPage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var chart_js_1 = require("chart.js");
var moment = require("moment");
var browser_1 = require("@capacitor/browser");
var GraphicsPage = /** @class */ (function () {
    function GraphicsPage(platform, router, menu, utils, sellerSrv, authSrv) {
        this.platform = platform;
        this.router = router;
        this.menu = menu;
        this.utils = utils;
        this.sellerSrv = sellerSrv;
        this.authSrv = authSrv;
        this.me = null;
        this.today = new Date();
        this.month = "";
        this.yearSold = new Date().getFullYear();
        this.rangMonths = '';
        this.yearCar = "";
        this.yearCarAux = '';
        this.brandCar = '';
        this.modelCar = '';
        this.triple_m = '';
        this.concesionary = '';
        //data filter 2
        this.dateTo = '';
        this.dateFrom = '';
        this.yearCar2 = '';
        this.yearCarAux2 = '';
        this.brandCar2 = '';
        this.modelCar2 = '';
        this.concesionary2 = '';
        this.id_user = '';
        //breadcrumb
        this.brand_breadcrumb = "";
        this.model_breadcrumb = "";
        this.year_breadcrumb = "";
        this.rangMonths_breadcrumb = "";
        this.month_breadcrumb = "";
        this.triple_m_breadcrumb = "";
        this.arrayLabels = [];
        this.arrayBrands = [];
        this.arrayModels = [];
        this.carListGraphic = [];
        this.arrayData = {};
        this.arrayListCars = [];
        this.dataGraphy = {};
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.me = this.authSrv.getMeData();
        if (this.me) {
            this.id_user = this.me.id;
        }
    }
    GraphicsPage.prototype.ngOnInit = function () {
    };
    GraphicsPage.prototype.ngAfterViewInit = function () {
        this.getChartGrafic();
        this.getBrands();
        this.getModels();
        this.getCarList();
    };
    GraphicsPage.prototype.goBack = function () {
        this.router.navigate(['seller']);
    };
    GraphicsPage.prototype.getBrands = function () {
        var _this = this;
        this.sellerSrv.allBrands().subscribe(function (res) {
            if (res.status) {
                _this.arrayBrands = res.data;
            }
        }, function (err) {
            console.log(err);
        });
    };
    GraphicsPage.prototype.getModels = function () {
        var _this = this;
        this.sellerSrv.allModels().subscribe(function (res) {
            if (res.status) {
                _this.arrayModels = res.data;
            }
        }, function (err) {
            console.log(err);
        });
    };
    GraphicsPage.prototype.openFile = function () {
        this.router.navigate(['mechanical-file']);
    };
    GraphicsPage.prototype.openMenu = function () {
        this.utils.setLogin(true);
        this.menu.open();
    };
    GraphicsPage.prototype.lineChartMethod = function () {
        this.lineChart = new chart_js_1.Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: this.dataGraphy
        });
    };
    GraphicsPage.prototype.getChartGrafic = function () {
        var _this = this;
        var data = {
            month: this.month,
            yearSold: this.yearSold,
            rangMonths: this.rangMonths,
            yearCar: this.yearCar,
            brandCar: this.brandCar,
            modelCar: this.modelCar,
            triple_m: this.triple_m,
            concesionary: this.concesionary
        };
        this.utils.presentLoading('Cargando datos');
        this.sellerSrv.getGrafic(data).subscribe(function (res) {
            if (res.status) {
                _this.utils.dismissLoading();
                _this.arrayLabels = res.data.labels;
                _this.arrayData = res.data.datasets[0];
                _this.dataGraphy = res.data;
                var emptyGraphy = 0;
                for (var i = 0; i < _this.dataGraphy.datasets[0].data.length; i++) {
                    var element = _this.dataGraphy.datasets[0].data[i];
                    if (element == 0) {
                        emptyGraphy++;
                    }
                }
                if (emptyGraphy == _this.dataGraphy.datasets[0].data.length) {
                    _this.utils.presentAlert("Sin resultado", "Grafica sin resultado", "");
                }
                if (res.data.list.length > 0) {
                    _this.carListGraphic = res.data.list;
                }
                _this.lineChartMethod();
                _this.month = 1;
                _this.month_breadcrumb = "1";
                _this.yearSold = new Date().getFullYear();
                _this.rangMonths = "";
                _this.yearCar = "";
                _this.brandCar = "";
                _this.modelCar = "";
            }
            else {
                _this.utils.dismissLoading();
                _this.utils.presentToast(res.message);
            }
        }, function (err) {
            console.log(err);
            _this.utils.dismissLoading();
            _this.utils.presentToast('Error de servidor');
        });
    };
    GraphicsPage.prototype.getCarList = function () {
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
                _this.arrayListCars = res.data.grupocard;
                // this.dateTo = ""
                // this.dateFrom = ""
                // this.yearCar2 = ""
                // this.brandCar2 = ""
                // this.modelCar2 = ""
                // this.concesionary2 = ""
            }
            else {
                _this.utils.presentToast(res.message);
            }
        }, function (err) {
            console.log(err);
            _this.utils.presentToast('Error de servidor');
        });
    };
    GraphicsPage.prototype.exportExcel = function () {
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
            _this.sellerSrv.exportExcel(data).subscribe(function (res) {
                _this.utils.dismissLoading2();
                if (res.status) {
                    _this.descargarArchivo(res.data.fileName, res.data.base64Data);
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
                    _this.utils.presentToast('Se mandado un correo de la exportación del excel ' + res.data.fileName);
                }
            }, function (err) {
                console.log(err);
            });
        });
    };
    GraphicsPage.prototype.descargarArchivo = function (nombreArchivo, dataBase64) {
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
    GraphicsPage.prototype.openModal = function () {
        this.modalFilter.present();
        this.month = 1;
        this.yearSold = new Date().getFullYear();
        this.rangMonths = '';
        this.yearCar = '';
        this.yearCarAux = '';
        this.brandCar = '';
        this.modelCar = '';
    };
    GraphicsPage.prototype.closeModal = function () {
        this.modalFilter.dismiss();
    };
    GraphicsPage.prototype.applyFilter = function () {
        if (this.lineChart) {
            this.lineChart.destroy();
        }
        this.getChartGrafic();
        this.modal.dismiss();
    };
    GraphicsPage.prototype.openModalVehicle = function () {
        this.modalVehicle.present();
        this.dateTo = '';
        this.dateFrom = '';
        this.yearCar2 = '';
        this.yearCarAux2 = '';
        this.brandCar2 = '';
        this.modelCar2 = '';
        this.concesionary2 = '';
    };
    GraphicsPage.prototype.closeModal2 = function () {
        this.modalVehicle.dismiss();
    };
    GraphicsPage.prototype.applyFilter2 = function () {
        this.getCarList();
        this.modalVehicle.dismiss();
    };
    GraphicsPage.prototype.dotMinYear = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.yearCarAux = num;
            this.yearCar = input.value.replace(/\./g, '');
            this.year_breadcrumb = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    GraphicsPage.prototype.dotMinYear2 = function (input) {
        var num = input.value.replace(/\./g, '');
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input.value = num;
            this.yearCarAux2 = num;
            this.yearCar2 = input.value.replace(/\./g, '');
        }
        else {
            input.value = input.value.replace(/[^\d\.]*/g, '');
        }
    };
    GraphicsPage.prototype.detailCar = function (id) {
        this.router.navigate(['car-detail/' + id + '/graphics']);
    };
    GraphicsPage.prototype.onDateFromChange = function (event) {
        this.dateFrom = moment(event.detail.value).format('YYYY-MM-DD');
    };
    GraphicsPage.prototype.onDateToChange = function (event) {
        this.dateTo = moment(event.detail.value).format('YYYY-MM-DD');
    };
    GraphicsPage.prototype.setDot = function (data) {
        var str = data.toString().split(".");
        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return str.join(".");
    };
    GraphicsPage.prototype.onChangeBrand = function (event) {
        this.brand_breadcrumb = event.detail.value;
    };
    GraphicsPage.prototype.onChangeModel = function (event) {
        this.model_breadcrumb = event.detail.value;
    };
    GraphicsPage.prototype.onInputYear = function (event) {
        this.year_breadcrumb = event.detail.value;
    };
    GraphicsPage.prototype.onChangeRngMonth = function (event) {
        this.rangMonths_breadcrumb = event.detail.value;
    };
    GraphicsPage.prototype.onChangeMonth = function (event) {
        this.month_breadcrumb = event.detail.value;
    };
    GraphicsPage.prototype.onChangeTripleM = function (event) {
        this.triple_m_breadcrumb = event.detail.value;
    };
    __decorate([
        core_1.ViewChild(angular_1.IonModal)
    ], GraphicsPage.prototype, "modal");
    __decorate([
        core_1.ViewChild('ModalFilterVehicleSeller')
    ], GraphicsPage.prototype, "modalVehicle");
    __decorate([
        core_1.ViewChild('ModalFilterGraphicSeller')
    ], GraphicsPage.prototype, "modalFilter");
    __decorate([
        core_1.ViewChild('lineCanvas')
    ], GraphicsPage.prototype, "lineCanvas");
    GraphicsPage = __decorate([
        core_1.Component({
            selector: 'app-graphics',
            templateUrl: './graphics.page.html',
            styleUrls: ['./graphics.page.scss']
        })
    ], GraphicsPage);
    return GraphicsPage;
}());
exports.GraphicsPage = GraphicsPage;
