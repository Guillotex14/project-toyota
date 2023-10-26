import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController,IonModal, IonPopover, IonActionSheet, IonicSafeString, AlertController } from '@ionic/angular';
import { AddVehicle, CreateMechanic } from 'src/models/sellet';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';
import { AuthService } from '../services/auth/auth.service';
import { ModalMechanicComponent } from '../components/modal-mechanic/modal-mechanic.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { states } from 'src/assets/json/states';
import { concesionaries } from 'src/assets/json/concesionaries';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {

  newVehicle: AddVehicle = new AddVehicle();
  openASEdit: boolean = false;
  openAS: boolean = false;
  showAutoComplete:boolean = false;
  disabledSave: boolean = false;
  aux: number = 0;
  auxDocs: number = 0;
  km: string = '';
  year: string = '';
  me: any = null;

  actionSheetButtons: any[] = [];
  actionSheetButtonsEdit: any[] = [];
  aSBtnsDocs: any[] = [];
  aSBtnsEditDocs: any[] = [];
  arrayImages: any[] = [];
  arrayDocuments: any[] = [];
  arrayZones: any[] = states;
  arrayConcesionaries: any[] = concesionaries;
  conceAux: any[] = concesionaries;
  arrayBrands: any[] = [];
  arrayMechanics: any[] = [];
  auxMechanic: any[] = [];
  arrayAutoComplete: any[] = [];
  mechanicName: string = '';
  mechanicCity: string = '';
  mechanicConcesionary: string = '';
  mechanicImg: string = '';

  newMechanic: CreateMechanic = new CreateMechanic();
  auxConces: any[] = concesionaries;
  typeInput: string = "password";
  typeInputConfirm: string = "password";

  emptyDisplacement: boolean = false;
  emptyTransmission: boolean = false;
  emptyTypeVehicle: boolean = false;
  emptyIdmechanic: boolean = false;
  emptyTraction: boolean = false;
  emptyTitles: boolean = false;
  emptyBrand: boolean = false;
  emptyModel: boolean = false;
  emptyPlate: boolean = false;
  validPlate: boolean = false;
  emptyFuel: boolean = false;
  emptyYear: boolean = false;
  validVin: boolean = false;
  emptyVin: boolean = false;
  emptyKm: boolean = false;

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('ActionSheetEdit') ActionSheetEdit!: IonActionSheet;
  @ViewChild('ActionSheet') ActionSheet!: IonActionSheet;
  @ViewChild('ActionSheetDocs') ActionSheetDocs!: IonActionSheet;
  @ViewChild('ActionSheetEditDocs') ActionSheetEditDocs!: IonActionSheet;
  @ViewChild('modalMechanic') modal!: IonModal;
  @ViewChild('modalAddMechanic') modalAddMechanic!: IonModal;
  @ViewChild('autoComplete') autoComplete!: IonPopover;

  buttonPhoto = [
    {
      text: 'Aceptar',
      handler: () =>{
        this.takePhoto();
        this.actionSheetButtons = [
          {
            text: 'Cámara',
            icon: 'camera',
            handler: () => {
              this.takePhoto();
            }
          },
          {
            text: 'Galeria',
            icon: 'image',
            handler: () => {
              this.presentAlert(2);
            }
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel'
          }
        ];
      }
    }
  ]

  buttonGallery = [
    {
      text: 'Aceptar',
      handler: () =>{
        this.takePhotoGalery();
        this.actionSheetButtons = [
          {
            text: 'Cámara',
            icon: 'camera',
            handler: () => {
              this.presentAlert(1);
            }
          },
          {
            text: 'Galeria',
            icon: 'image',
            handler: () => {
              this.takePhotoGalery();
            }
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel'
          }
        ];
      }
    }
  ]

  constructor(private menu: MenuController, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private modalCtrl: ModalController, private alertCtrl: AlertController, private authSrv: AuthService) {

    this.newVehicle.brand = '';
    this.newVehicle.city = '';
    this.newVehicle.comfort = false;
    this.newVehicle.dealer = '';
    this.newVehicle.displacement = '';
    this.newVehicle.engine_model = '';
    this.newVehicle.fuel = '';
    this.newVehicle.km = 0;
    this.newVehicle.model = '';
    this.newVehicle.performance = false;
    this.newVehicle.titles = '';
    this.newVehicle.technology = false;
    this.newVehicle.traction_control = false;
    this.newVehicle.transmission = '';
    this.newVehicle.traction = '';
    this.newVehicle.year = 0;
    this.newVehicle.price = 0;
    this.newVehicle.images = [];
    this.newVehicle.concesionary = '';
    this.newVehicle.id_mechanic = '';
    this.newVehicle.type_vehicle = '';
    this.newVehicle.vin = '';
    this.newVehicle.vehicle_plate = '';
    this.newVehicle.imgs_documents = [];

    this.newMechanic.email = "";
    this.newMechanic.password = "";
    this.newMechanic.password_confirm = "";
    this.newMechanic.city = "";
    this.newMechanic.concesionary = "";
    this.newMechanic.fullName = "";
    this.newMechanic.username = "";

    this.me = this.authSrv.getMeData();

    if (this.me != null) {
      this.newVehicle.id_seller = this.me.id_sell;
      this.newVehicle.city = this.me.city;
      this.newVehicle.concesionary = this.me.concesionary;
      this.newMechanic.city = this.me.city;
      this.newMechanic.concesionary = this.me.concesionary;
    }else{
      this.newVehicle.id_seller = '';
      this.newVehicle.city = '';
      this.newVehicle.concesionary = '';
    }

    this.buttonsActionSheet();
    this.buttonsActionSheetEdit();
    this.buttonsASDoc();
    this.buttonsAStEditDoc();
    this.getBrands();
    this.filterMechanic();
    this.getAutoComplete();
  }

  ngOnInit() {
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['seller']);
  }

  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res: any) => {
        this.arrayBrands = res.data;

      }, (err: any) => {
        console.log(err);
      });

  }

  public addVehicle() {
    this.utils.presentLoading("Agregando vehículo...");

    if(this.newVehicle.model == "" || this.newVehicle.model == null || this.newVehicle.model == undefined){
      this.emptyModel = true;
      return;
    }

        
    if(this.newVehicle.type_vehicle == "" || this.newVehicle.type_vehicle == null || this.newVehicle.type_vehicle == undefined){
      this.emptyTypeVehicle = true;
      return;
    }

    if(this.newVehicle.brand == "" || this.newVehicle.brand == null || this.newVehicle.brand == undefined){
      this.emptyBrand = true;
      return;
    } 

    if(this.year == "" || this.year == null || this.year == undefined){
      this.emptyYear = true;
      return;
    }

    if(this.newVehicle.vin == "" || this.newVehicle.vin == null || this.newVehicle.vin == undefined){
      this.emptyVin = true;
      return;
    }

    if(this.newVehicle.vehicle_plate == "" || this.newVehicle.vehicle_plate == null || this.newVehicle.vehicle_plate == undefined){
      this.emptyPlate = true;
      return;
    }

    if(this.newVehicle.displacement == "" || this.newVehicle.displacement == null || this.newVehicle.displacement == undefined){
      this.emptyDisplacement = true;
      return;
    }

    if(this.km == "" || this.km == null || this.km == undefined){
      this.emptyKm = true;
      return;
    }

    if(this.newVehicle.titles == "" || this.newVehicle.titles == null || this.newVehicle.titles == undefined){
      this.emptyTitles = true;
      return;
    }

    if(this.newVehicle.fuel == "" || this.newVehicle.fuel == null || this.newVehicle.fuel == undefined){
      this.emptyFuel = true;
      return;
    }

    if(this.newVehicle.transmission == "" || this.newVehicle.transmission == null || this.newVehicle.transmission == undefined){
      this.emptyTransmission = true;
      return;
    }

    if(this.newVehicle.traction == "" || this.newVehicle.traction == null || this.newVehicle.traction == undefined){
      this.emptyTraction = true;
      return;
    }

    if(this.newVehicle.id_mechanic == "" || this.newVehicle.id_mechanic == null || this.newVehicle.id_mechanic == undefined){
      this.emptyIdmechanic = true;
      return;
    }
    
    this.disabledSave = true;
    this.newVehicle.images = this.arrayImages;
    this.newVehicle.year = parseInt(this.year);
    this.newVehicle.imgs_documents = this.arrayDocuments;
    this.newVehicle.vin = this.newVehicle.vin.toUpperCase();
    this.newVehicle.km = parseInt(this.km.replace(/\./g,''));
    this.newVehicle.vehicle_plate = this.newVehicle.vehicle_plate.toUpperCase();
    this.sellerSrv.addVehicle(this.newVehicle).subscribe((resp:any) => {
      if(resp.status){
        this.utils.dismissLoading();
        this.utils.presentToast(resp.message);
        this.emptyForm();
        this.arrayImages = [];
        this.disabledSave = false;
        this.router.navigate(['/seller']);
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al agregar vehículo");
      }
    },
    (err:any) => {
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  }

  public deleteImage(index:any){
    this.arrayImages.splice(index,1)
  }

  public deleteImageDoc(index:any){
    this.arrayDocuments.splice(index,1)
  }

  public editImage(index:any){
    this.aux = index;
    this.editTakePhotoGalery();
  }

  public emptyForm(){
    this.newVehicle.brand = '';
    this.newVehicle.comfort = false;
    this.newVehicle.dealer = '';
    this.newVehicle.displacement = '';
    this.newVehicle.engine_model = '';
    this.newVehicle.fuel = '';
    this.newVehicle.km = 0;
    this.newVehicle.model = '';
    this.newVehicle.performance = false;
    this.newVehicle.titles = '';
    this.newVehicle.technology = false;
    this.newVehicle.traction_control = false;
    this.newVehicle.transmission = '';
    this.newVehicle.traction = '';
    this.newVehicle.year = 0;
    this.newVehicle.vin = '';
    this.newVehicle.vehicle_plate = '';
    this.newVehicle.images = [];
    this.newVehicle.type_vehicle = '';
    this.mechanicCity = '';
    this.mechanicConcesionary = '';
    this.mechanicImg = '';
    this.mechanicName = '';
    this.year = '';
    this.km = '';
  }

  public async modalMechanic(){
    const modal = await this.modalCtrl.create({
      component: ModalMechanicComponent,
      cssClass: 'modal-mechanic',
      componentProps: {
        data: this.newVehicle.concesionary
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if(data.id_mechanic != undefined || data.id_mechanic != null || data.id_mechanic != ''){
      this.newVehicle.id_mechanic = data.id_mechanic;
      this.utils.dismissLoading();
    }

  }

  public async takePhoto(){
    
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      let img = {
        image: imageData.dataUrl,
      }
      this.arrayImages.push(img);
    },
    (err)=>{
      console.log(err)
    });
    this.utils.dismissLoading();
  }

  public async takePhotoGalery(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then(async (imageData) => {
      let img = {
        image: imageData.dataUrl,
      }
      this.arrayImages.push(img);
    } ,
    (err)=>{
      console.log(err)
      this.utils.dismissLoading();
    });
    this.utils.dismissLoading();
  }

  public async editTakePhoto(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then (async (imageData) => {
      this.arrayImages[this.aux].image = imageData.dataUrl;
      // this.utils.dismissLoading();
    } ,
    (err)=>{
      console.log(err)
    });
    this.utils.dismissLoading();
  }

  public async editTakePhotoGalery(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then (async (imageData) => {
      this.arrayImages[this.aux].image = imageData.dataUrl;
    } ,
    (err)=>{
      console.log(err)
    });
    this.utils.dismissLoading();

  }
  
  public openActionSheetEdit(index:any){
    this.ActionSheetEdit.present();
    this.aux = index;
  }

  public openActionSheet(){
    this.ActionSheet.present();
  }

  public buttonsActionSheet(){
    this.actionSheetButtons = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.presentAlert(1);
        }
      },
      {
        text: 'Galeria',
        icon: 'image',
        handler: () => {
          this.presentAlert(2);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }
    ]
  }

  public buttonsActionSheetEdit(){

    this.actionSheetButtonsEdit = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.editTakePhoto();
        }
      },
      {
        text: 'Galeria edit',
        icon: 'image',
        handler: () => {
          this.editTakePhotoGalery();
        }
      },
      {
        text: 'Salir',
        icon: 'close',
        role: 'cancel'
      }
    ]
  }

  public openASEditDocs(index:any){
    this.ActionSheetEditDocs.present();
    this.auxDocs = index;
  }

  public openASDocs(){
    this.ActionSheetDocs.present();
  }

  public buttonsASDoc(){
    this.aSBtnsDocs = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.takePhotoDoc();
        }
      },
      {
        text: 'Galeria',
        icon: 'image',
        handler: () => {
          this.takePhotoGaleryDoc();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }
    ]
    

  }

  public buttonsAStEditDoc(){

    this.aSBtnsEditDocs = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.editTakePhotoDoc();
        }
      },
      {
        text: 'Galeria edit',
        icon: 'image',
        handler: () => {
          this.editTakePhotoGaleryDoc();
        }
      },
      {
        text: 'Salir',
        icon: 'close',
        role: 'cancel'
      }
    ]
  }

  public filterConces(){

    if (this.newVehicle.city == '' || this.newVehicle.city == undefined || this.newVehicle.city == null) {
      this.conceAux = this.arrayConcesionaries;
    }else{

      this.conceAux = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].estado.toLowerCase();
        if (zon.includes(this.newVehicle.city.toLowerCase())) {
          this. conceAux.push(this.arrayConcesionaries[i]);
        }
      }

    }

  }

  public filterMechanic(){
    if (this.newVehicle.concesionary !== "") {
      let data = {
        concesionary: this.newVehicle.concesionary,
      }
      this.arrayMechanics = [];
      this.sellerSrv.getMechanicByConcesionary(data).subscribe((res:any)=>{
        if (res.status) {
          
          this.arrayMechanics = res.data;
        }else{
          this.arrayMechanics = [];
        }
      })
    }else{
      this.arrayMechanics = this.auxMechanic;
    }
  
  }

  public onWillDismiss(event: any) {
    if (event.detail.role === 'confirm') {
      this.utils.presentToast(`Técnico seleccionado correctamente ${event.detail.data.mechanic.fullName}`);
      this.newVehicle.id_mechanic = event.detail.data.mechanic._id;
      this.mechanicName = event.detail.data.mechanic.fullName;
      this.mechanicCity = event.detail.data.mechanic.city;
      this.mechanicConcesionary = event.detail.data.mechanic.concesionary;
      this.mechanicImg = event.detail.data.mechanic.image !=="" ? event.detail.data.mechanic.image.img : '';
    }
  }

  public dismissModal(){
    this.modalCtrl.dismiss({
      id_mechanic: ''
    }, "cancel");
  }

  public dismissModalCreateMechanic(){
    this.modalAddMechanic.dismiss();
    this.modal.present();
  }

  public async addMechanic(){
    this.modalAddMechanic.present();
  }

  public selectMechanic(id_mechanic: string){
    this.modalCtrl.dismiss({
      mechanic: id_mechanic
    }, "confirm");
  }

  public openModal(){
    this.modal.present();
    this.filterMechanic();
  }

  public setDotKm(input:any){
    
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.km = num;
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }

  }

  public searchAutoComplete(){
    this.showAutoComplete = true;
    this.getAutoComplete(); 
  }

  public getAutoComplete(){

    let data = {
      search: this.newVehicle.model
    }

    this.sellerSrv.autoComplete(data).subscribe((res:any)=>{
      if (res.status) {
        this.arrayAutoComplete = res.data;
      }
    })
  }

  public selectAutoComplete(item:any){
    this.newVehicle.model = item.model;
    this.newVehicle.brand = item.brand;
    this.newVehicle.type_vehicle = item.type_vehicle;
    this.arrayAutoComplete = [];
    this.showAutoComplete = false;
  }

  public createMechanic(){

    if (this.newMechanic.email != "" && this.newMechanic.password != "" && this.newMechanic.password_confirm != "" && this.newMechanic.city != "" && this.newMechanic.concesionary != "" && this.newMechanic.fullName != "" && this.newMechanic.username != "" && this.newMechanic.phone != "") {
      this.sellerSrv.addMechanic(this.newMechanic).subscribe((data:any)=>{
        if (data.status) {
          this.utils.presentToast(data.message);
          this.newMechanic.email = "";
          this.newMechanic.password = "";
          this.newMechanic.password_confirm = "";
          this.newMechanic.city = "";
          this.newMechanic.concesionary = "";
          this.newMechanic.fullName = "";
          this.newMechanic.username = "";
          this.filterMechanic();
          this.dismissModalCreateMechanic();
        }else{
          this.utils.presentToast(data.message);
        }

      }
      ,(error:any)=>{
        console.log(error);
      });
    }else{
      if (this.newMechanic.email == "") {
        this.utils.presentToast("El email es obligatorio");
        return;
      }

      if (this.newMechanic.password == "") {
        this.utils.presentToast("La contraseña es obligatoria");
        return
      }

      if (this.newMechanic.password_confirm == "") {
        this.utils.presentToast("La confirmación de la contraseña es obligatoria");
        return
      }

      if (this.newMechanic.password != this.newMechanic.password_confirm) {
        this.utils.presentToast("Las contraseñas no coinciden");
        return
      }

      if (this.newMechanic.city == "") {
        this.utils.presentToast("La estado es obligatoria");
        return
      }

      if (this.newMechanic.concesionary == "") {
        this.utils.presentToast("La concesionaria es obligatoria");
        return
      }

      if (this.newMechanic.fullName == "") {
        this.utils.presentToast("El nombre completo es obligatorio");
        return
      }

      if (this.newMechanic.username == "") {
        this.utils.presentToast("El nombre de usuario es obligatorio");
        return
      }

      if (this.newMechanic.phone == "") {
        this.utils.presentToast("El numero teléfonico es obligatorio");
        return
      }
    }
  }

  public showPassword() {
    if (this.typeInput == "password") {
      this.typeInput = "text";
    } else {
      this.typeInput = "password";
    }
  }

  public showPasswordConfirm() {
    if (this.typeInputConfirm == "password") {
      this.typeInputConfirm = "text";
    } else {
      this.typeInputConfirm = "password";
    }
  }

  public async presentAlert(data:any) {
    const alert = await this.alertCtrl.create({
      header: 'Información',
      message: new IonicSafeString('<p>1. Lateral completo</p> <p>2. Tres cuartos frente conductor</p> <p>3. Tres cuartos trasero copiloto</p> <p>4.Interior frente torpedo completo</p> <p>5.Interior frente tablero de instrumentos (visualización del kilometraje)</p>'),
      buttons: data === 1 ? this.buttonPhoto : this.buttonGallery
    });
    await alert.present();
  }

  public async takePhotoDoc(){
    
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      let img = {
        image: imageData.dataUrl,
      }
      this.arrayDocuments.push(img);
    },
    (err)=>{
      console.log(err)
    });
    this.utils.dismissLoading();
  }

  public async takePhotoGaleryDoc(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then(async (imageData) => {
      let img = {
        image: imageData.dataUrl,
      }
      this.arrayDocuments.push(img);
    } ,
    (err)=>{
      console.log(err)
      this.utils.dismissLoading();
    });
    this.utils.dismissLoading();
  }

  public async editTakePhotoDoc(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then (async (imageData) => {
      this.arrayDocuments[this.auxDocs].image = imageData.dataUrl;
    } ,
    (err)=>{
      console.log(err)
    });
    this.utils.dismissLoading();
  }

  public async editTakePhotoGaleryDoc(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then (async (imageData) => {
      this.arrayDocuments[this.auxDocs].image = imageData.dataUrl;
    } ,
    (err)=>{
      console.log(err)
    });
    this.utils.dismissLoading();

  }

  public validateVin(e:any){
    
    if (e.target.value != "") {
      this.emptyVin = false;
    }

    if (e.target.value.length < 17) {
      this.validVin = true;
    }else{
      this.validVin = false;
    }

  }

  public validatePlate(e:any){
    
    if (e.target.value != "") {
      this.emptyPlate = false;
    }

    if (e.target.value.length < 7) {
      this.validPlate = true;
    }else{
      this.validPlate = false;
    }

  }

  public validateModel(e:any){
    
    if (e.target.value != "") {
      this.emptyModel = false;
    }

  }

  public validateTypeVehicle(e:any){
    if (e.target.value != "") {
      this.emptyTypeVehicle = false;
    }
  
  }

  public validateBrand(e:any){
    
    if (e.target.value != "") {
      this.emptyBrand = false;
    }

  }

  public validateDisplacement(e:any){
    
    if (e.target.value != "") {
      this.emptyDisplacement = false;
    }

  }

  public validateKm(e:any){
    
    if (e.target.value != "") {
      this.emptyKm = false;
    }

  }

  public validateTitles(e:any){
    
    if (e.target.value != "") {
      this.emptyTitles = false;
    }

  }

  public validateTransmission(e:any){
    
    if (e.target.value != "") {
      this.emptyTransmission = false;
    }

  }

  public validateTraction(e:any){
    
    if (e.target.value != "") {
      this.emptyTraction = false;
    }

  }

  public validateFuel(e:any){
    
    if (e.target.value != "") {
      this.emptyFuel = false;
    }

  }

  public validateIdMechanic(e:any){
    
    if (e.target.value != "") {
      this.emptyIdmechanic = false;
    }

  }

  public validateYear(e:any){
    
    if (e.target.value != "") {
      this.emptyYear = false;
    }

  }


}
