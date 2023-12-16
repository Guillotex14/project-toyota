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
exports.MechanicalFileDetailPage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var sellet_1 = require("src/models/sellet");
var MechanicalFileDetailPage = /** @class */ (function () {
    function MechanicalFileDetailPage(alertController, route, platform, actRoute, sellerSrv, utils) {
        this.alertController = alertController;
        this.route = route;
        this.platform = platform;
        this.actRoute = actRoute;
        this.sellerSrv = sellerSrv;
        this.utils = utils;
        this.android = false;
        this.ios = false;
        this.web = false;
        this.backToTop = false;
        this.id = "";
        this.theRoute = "";
        this.loading = true;
        this.reportes = [];
        this.mechanicalFile = new sellet_1.CarDetailMechanicalFile();
        this.id = this.actRoute.snapshot.params['id'];
        this.theRoute = this.actRoute.snapshot.params['route'];
        if (platform.is('android')) {
            this.android = true;
        }
        else if (platform.is('ios')) {
            this.ios = true;
        }
        else if (platform.is('mobileweb')) {
            this.web = true;
        }
        this.mechanicalFile.part_emblems_complete = "";
        this.mechanicalFile.wiper_shower_brushes_windshield = "";
        this.mechanicalFile.hits = "";
        this.mechanicalFile.paint_condition = "";
        this.mechanicalFile.bugle_accessories = "";
        this.mechanicalFile.air_conditioning_system = "";
        this.mechanicalFile.radio_player = "";
        this.mechanicalFile.courtesy_lights = "";
        this.mechanicalFile.upholstery_condition = "";
        this.mechanicalFile.board_lights = "";
        this.mechanicalFile.tire_life = "";
        this.mechanicalFile.battery_status_terminals = "";
        this.mechanicalFile.transmitter_belts = "";
        this.mechanicalFile.motor_oil = "";
        this.mechanicalFile.engine_coolant_container = "";
        this.mechanicalFile.radiator_status = "";
        this.mechanicalFile.exhaust_pipe_bracket = "";
        this.mechanicalFile.distribution_mail = "";
        this.mechanicalFile.fuel_system = "";
        this.mechanicalFile.parking_break = "";
        this.mechanicalFile.brake_bands_drums = "";
        this.mechanicalFile.brake_pads_discs = "";
        this.mechanicalFile.master_cylinder = "";
        this.mechanicalFile.brake_fluid = "";
        this.mechanicalFile.bushings_plateaus = "";
        this.mechanicalFile.stumps = "";
        this.mechanicalFile.terminals = "";
        this.mechanicalFile.stabilizer_bar = "";
        this.mechanicalFile.bearings = "";
        this.mechanicalFile.tripoids_rubbe_bands = "";
        this.mechanicalFile.shock_absorbers_coils = "";
        this.mechanicalFile.dealer_maintenance = "";
        this.mechanicalFile.general_condition = "";
        this.mechanicalFile.odometer = "";
        this.mechanicalFile.engine_start = "";
        this.mechanicalFile.windshields_glass = "";
        this.mechanicalFile.hits_scratches = "";
        this.mechanicalFile.spark_plugs = "";
        this.mechanicalFile.injectors = "";
        this.mechanicalFile.fuel_filter_anti_pollen_filter = "";
        this.mechanicalFile.engine_noises = "";
        this.mechanicalFile.hits_scratches_sides = "";
        this.mechanicalFile.paint_condition_sides = "";
        this.mechanicalFile.trunk_hatch = "";
        this.mechanicalFile.spare_tire = "";
        this.mechanicalFile.hits_scratches_trunk = "";
        this.mechanicalFile.paint_condition_trunk = "";
        this.mechanicalFile.headlights_lights_trunk = "";
        this.mechanicalFile.fuel_tank_cover = "";
        this.mechanicalFile.pipes_hoses_connections = "";
        this.mechanicalFile.brake_discs = "";
    }
    MechanicalFileDetailPage.prototype.ngOnInit = function () {
    };
    MechanicalFileDetailPage.prototype.ionViewWillEnter = function () {
        this.getMechanicFile();
    };
    MechanicalFileDetailPage.prototype.getScrollPos = function (pos) {
        if (pos.detail.scrollTop > this.platform.height()) {
            this.backToTop = true;
        }
        else {
            this.backToTop = false;
        }
    };
    MechanicalFileDetailPage.prototype.goBack = function () {
        this.route.navigate(['car-detail/' + this.id + '/' + this.theRoute]);
    };
    MechanicalFileDetailPage.prototype.getMechanicFile = function () {
        var _this = this;
        var data = {
            id_vehicle: this.id
        };
        this.utils.presentLoading("Cargando...");
        this.sellerSrv.mechanicFile(data).subscribe(function (r) {
            if (r.status) {
                _this.loading = false;
                _this.mechanicalFile = r.data;
                _this.getListReport(_this.mechanicalFile);
                _this.utils.dismissLoading();
            }
            else {
                _this.utils.dismissLoading();
                _this.utils.presentToast(r.message);
            }
        }, function (error) {
            _this.utils.dismissLoading();
            _this.utils.presentToast("Error de servidor");
        });
    };
    MechanicalFileDetailPage.prototype.getListReport = function (data) {
        var _this = this;
        this.sellerSrv.getReportList({ id: data._id }).subscribe(function (r) {
            if (r.status) {
                _this.reportes = r.data;
                for (var i = 0; i < _this.reportes.length; i++) {
                    _this.reportes[i].showcontent = true;
                    _this.reportes[i].campos_actualizados_list = [];
                    _this.reportes[i].show_actualizados_list = false;
                    for (var clave in _this.reportes[i].campos_actualizados) {
                        _this.reportes[i].campos_actualizados_list.push(clave + ": " + _this.reportes[i].campos_actualizados[clave]);
                    }
                    _this.reportes[i].campos_anteriores_list = [];
                    _this.reportes[i].show_anteriores_list = false;
                    for (var clave in _this.reportes[i].campos_anteriores) {
                        _this.reportes[i].campos_anteriores_list.push(clave + ": " + _this.reportes[i].campos_anteriores[clave]);
                    }
                }
            }
        });
    };
    MechanicalFileDetailPage.prototype.scrollToTop = function () {
        this.content.scrollToTop(500);
    };
    MechanicalFileDetailPage.prototype.seeCamposActualizados = function (item) {
        for (var i = 0; i < this.reportes.length; i++) {
            if (this.reportes[i]._id == item._id) {
                this.reportes[i].showcontent = !this.reportes[i].showcontent;
                this.reportes[i].show_actualizados_list = !this.reportes[i].show_actualizados_list;
            }
        }
    };
    MechanicalFileDetailPage.prototype.seeCamposAnteriores = function (item) {
        for (var i = 0; i < this.reportes.length; i++) {
            if (this.reportes[i]._id == item._id) {
                this.reportes[i].showcontent = !this.reportes[i].showcontent;
                this.reportes[i].show_anteriores_list = !this.reportes[i].show_anteriores_list;
            }
        }
    };
    MechanicalFileDetailPage.prototype.addReport = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: "Nuevo reporte",
                            subHeader: "",
                            message: "",
                            inputs: [
                                {
                                    name: 'comentario',
                                    type: 'textarea',
                                    placeholder: 'Comentario'
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel',
                                    handler: function () {
                                    }
                                }, {
                                    text: 'Aceptar',
                                    handler: function (data) {
                                        var report = {
                                            comment: data.comentario,
                                            id_mechanic_file: item._id
                                        };
                                        _this.sellerSrv.addRerport(report).subscribe(function (r) {
                                            _this.getListReport(item);
                                        });
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
    __decorate([
        core_1.ViewChild(angular_1.IonContent)
    ], MechanicalFileDetailPage.prototype, "content");
    MechanicalFileDetailPage = __decorate([
        core_1.Component({
            selector: 'app-mechanical-file-detail',
            templateUrl: './mechanical-file-detail.page.html',
            styleUrls: ['./mechanical-file-detail.page.scss']
        })
    ], MechanicalFileDetailPage);
    return MechanicalFileDetailPage;
}());
exports.MechanicalFileDetailPage = MechanicalFileDetailPage;
