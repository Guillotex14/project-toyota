import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController,IonModal, IonPopover } from '@ionic/angular';
import { AddVehicle } from 'src/models/sellet';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';
import { ModalMechanicComponent } from '../components/modal-mechanic/modal-mechanic.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { states } from 'src/assets/json/states';
import { concesionaries } from 'src/assets/json/concesionaries';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {

  newVehicle: AddVehicle = new AddVehicle();
  typeConection: boolean = false;
  openASEdit: boolean = false;
  showAutoComplete = false;
  aux: number = 0;
  km: string = '';
  year: string = '';


  actionSheetButtons: any[] = [];
  actionSheetButtonsEdit: any[] = [];
  arrayImages: any[] = [];
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

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('ActionSheetEdit') ActionSheetEdit: any;
  @ViewChild('modalMechanic') modal!: IonModal;
  @ViewChild('autoComplete') autoComplete!: IonPopover;

  constructor(private menu: MenuController, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private modalCtrl: ModalController) {

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

    if (this.utils.isApp()) {
      this.typeConection = true;
    }

    let data = localStorage.getItem('me');

    if (data) {
      let me = JSON.parse(data);
      this.newVehicle.id_seller = me.id_sell;
      this.newVehicle.city = me.city;
      this.newVehicle.concesionary = me.concesionary;
    }else{
      this.newVehicle.id_seller = '';
      this.newVehicle.city = '';
      this.newVehicle.concesionary = '';
    }

    this.buttonsActionSheet();
    this.buttonsActionSheetEdit();
    this.getBrands();
    this.getMechanics();
    this.filterMechanic();
    this.getAutoComplete();
  }

  ngOnInit() {
  }

  public openMenu() {
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['seller']);
  }

  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res: any) => {
        console.log(res)
        this.arrayBrands = res.data;

      }, (err: any) => {
        console.log(err);
      });

  }

  public getMechanics(){
    this.utils.presentLoading('Cargando mecanicos...');
    this.sellerSrv.getMechanics().subscribe((data: any) => {
      console.log(data)
      if (data.status) {
        this.arrayMechanics = data.data;
        this.auxMechanic = data.data;
        this.utils.dismissLoading();
      }
    }, error => {
      this.utils.dismissLoading();
      this.utils.presentToast('Error al cargar los mecanicos, intente nuevamente');
    });
  }

  public addVehicle() {
    this.utils.presentLoading("Agregando vehículo...");
    this.newVehicle.images = this.arrayImages;
    if(this.newVehicle.model == "" || this.newVehicle.model == null || this.newVehicle.model == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("El modelo del vehículo es obligatorio");
      return;

    }

    if(this.newVehicle.brand == "" || this.newVehicle.brand == null || this.newVehicle.brand == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("La marca del vehículo es obligatoria");
      return;
    }

    if(this.year == "" || this.year == null || this.year == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("El año del vehículo es obligatorio");
      return;
    }

    // if(this.newVehicle.price == "" || this.newVehicle.price == null || this.newVehicle.price == undefined){
    //   this.utils.dismissLoading();
    //   this.utils.presentToast("El precio del vehículo es obligatorio");
    //   return;
    // }

    if(this.newVehicle.displacement == "" || this.newVehicle.displacement == null || this.newVehicle.displacement == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("El desplazamiento del vehículo es obligatorio");
      return;
    }

    if(this.km == "" || this.km == null || this.km == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("Los kilómetros del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.engine_model == "" || this.newVehicle.engine_model == null || this.newVehicle.engine_model == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("El modelo del motor del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.titles == "" || this.newVehicle.titles == null || this.newVehicle.titles == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("Los títulos del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.transmission == "" || this.newVehicle.transmission == null || this.newVehicle.transmission == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("El transmición del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.traction == "" || this.newVehicle.traction == null || this.newVehicle.traction == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("La tracción del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.fuel == "" || this.newVehicle.fuel == null || this.newVehicle.fuel == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("El combustible del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.city == "" || this.newVehicle.city == null || this.newVehicle.city == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("La ciudad del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.concesionary == "" || this.newVehicle.concesionary == null || this.newVehicle.concesionary == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("La zona del vehículo es obligatorio");
      return;
    }

    if(this.newVehicle.id_mechanic == "" || this.newVehicle.id_mechanic == null || this.newVehicle.id_mechanic == undefined){
      this.utils.dismissLoading();
      this.utils.presentToast("Debe seleccionar un mecánico para la revisión del vehículo");
      return;
    }

    this.newVehicle.year = parseInt(this.year);
    this.newVehicle.km = parseInt(this.km);

    this.sellerSrv.addVehicle(this.newVehicle).subscribe((resp:any) => {
      if(resp.status){
        this.utils.dismissLoading();
        this.utils.presentToast(resp.message);
        this.emptyForm();
        this.arrayImages = [];
        this.router.navigate(['/seller']);
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al agregar vehículo");
      }
    })
  }

  public deleteImage(index:any){
    this.arrayImages.splice(index,1)
  }

  public addImage() {
    this.fileInput.nativeElement.click();
  }

  public getImage(file:FileList){
    this.utils.presentLoading("Cargando imagen...");
    let reader = new FileReader();
    reader.onload = (e:any)=>{
      let info = e.target["result"];
      let split = info.split("base64");
      let split2 = split[0].split("/");
      let type = split2[1];

      let img = {
        image:e.target["result"],
      }
      this.arrayImages.push(img);
      this.utils.dismissLoading();
    }
    reader.readAsDataURL(file[0]);
  }

  public getImage2(file:FileList){
    this.utils.presentLoading("Cargando imagen...");
    let reader = new FileReader();
    console.log(this.aux);
    reader.onload = (e:any)=>{
      this.arrayImages[this.aux].image = +e.target["result"];
      this.utils.dismissLoading();
      console.log(this.arrayImages)
    }
    reader.readAsDataURL(file[0]);
  }

  public editImage(index:any){
    this.aux = index;
    this.fileInput2.nativeElement.click();
  }

  public emptyForm(){
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
    this.newVehicle.images = [];
    this.year = '';
    this.km = '';
  }

  public async modalMechanic(){
    console.log(this.newVehicle.concesionary)
    const modal = await this.modalCtrl.create({
      component: ModalMechanicComponent,
      cssClass: 'modal-mechanic',
      componentProps: {
        data: this.newVehicle.concesionary
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    console.log(data)

    if(data.id_mechanic != undefined || data.id_mechanic != null || data.id_mechanic != ''){
      this.newVehicle.id_mechanic = data.id_mechanic;
      this.utils.dismissLoading();
    }

  }

  public async takePhoto(){
    console.log("entro")
    // this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      console.log(imageData)
      // let base64 = 'data:image/jpeg;base64,'+imageData.dataUrl;
      // let img = {
      //   image: base64,
      // }
      // this.arrayImages.push(img);
    })
  }

  public async takePhotoGalery(){
    console.log("entro")
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then((imageData)=>{
      console.log(imageData)
      // let base64 = 'data:image/jpeg;base64,'+imageData.dataUrl;
      // this.arrayImages[this.aux].image = base64;
      // this.utils.dismissLoading();
    },
    (err)=>{
      console.log(err)
      // this.utils.dismissLoading();
    }

    )

  }

  public async editTakePhoto(){
    console.log(this.aux);
    // this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.pickImages({
      quality: 90,
      // allowEditing: false,
      // resultType: CameraResultType.DataUrl,
      // source: CameraSource.Photos,
    }).then((imageData)=>{
      console.log(imageData)
      // let base64 = 'data:image/jpeg;base64,'+imageData;
      // let img = {
      //   image: base64,
      // }
      // this.arrayImages.push(img);

      // this.utils.dismissLoading();
    } ,
    (err)=>{
      console.log(err)
      // this.utils.dismissLoading();
    })
  }

  public async editTakePhotoGalery(){
    console.log(this.aux);
    // this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.pickImages({
      quality: 90,

    }).then((imageData)=>{
      console.log(imageData)
      // let base64 = 'data:image/jpeg;base64,'+imageData;
      // this.arrayImages[this.aux].image = base64;
      // this.utils.dismissLoading();
    } ,
    (err)=>{
      console.log(err)
      // this.utils.dismissLoading();
    })

  }

  public openActionSheetEdit(index:any){
    console.log(index)
    this.openASEdit = true;
    this.aux = index;
    // this.ActionSheetEdit.open();
  }

  public buttonsActionSheet(){
    this.actionSheetButtons = [
      {
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          this.takePhoto();
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
    ]
  }

  public buttonsActionSheetEdit(){

    this.actionSheetButtonsEdit = [
      {
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          this.editTakePhoto();
        }
      },
      {
        text: 'Galeria',
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

  public filterConces(){

    console.log(this.newVehicle.city)
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
    console.log(this.newVehicle.concesionary)
    if (this.newVehicle.concesionary !== "") {
      let data = {
        concesionary: this.newVehicle.concesionary,
      }
      this.arrayMechanics = [];
      this.sellerSrv.getMechanicByConcesionary(data).subscribe((res:any)=>{
        console.log(res)
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
    console.log(event.detail.data);
    if (event.detail.role === 'confirm') {
      this.utils.presentToast(`Mecanico seleccionado correctamente ${event.detail.data.mechanic.fullName}`);
      this.newVehicle.id_mechanic = event.detail.data.mechanic._id;
      this.mechanicName = event.detail.data.mechanic.fullName;
      this.mechanicCity = event.detail.data.mechanic.city;
      this.mechanicConcesionary = event.detail.data.mechanic.concesionary;
    }
  }

  public dismissModal(){
    this.modalCtrl.dismiss({
      id_mechanic: ''
    }, "cancel");
  }

  public async addMechanic(){

    // this.dismissModal();

    // const addMechanic = await this.modalCtrl.create({
    //   component: ModalAddMechanicComponent,
    //   cssClass: 'modal-add-mechanic'
    // });

    // await addMechanic.present();

  }

  public selectMechanic(id_mechanic: string){
    // this.utils.presentLoading('Seleccionando mecanico...');
    console.log(id_mechanic)
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
      this.newVehicle.km = input.value.replace(/\./g,'');
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
}
