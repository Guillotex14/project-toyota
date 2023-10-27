import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonActionSheet, IonModal, IonPopover, MenuController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { CarDetailSeller } from 'src/models/sellet';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
})
export class CarDetailPage implements OnInit {
  carDetail: CarDetailSeller = new CarDetailSeller();
  actionSheetButtonsEdit: any[] = [];
  showAutoComplete:boolean = false;
  typeConection: boolean = false;
  actionSheetButtons: any[] = [];
  arrayAutoComplete: any[] = [];  
  invalidEmail: boolean = false;
  openASEdit: boolean = false;
  emptyEmail: boolean = false;
  arrayDocuments: any[] = [];
  priceOfertAux: string = "";
  editPrice: boolean = false;
  theCartegory: string = "";
  editCar: boolean = false;
  openAS: boolean = false;
  arrayBrands: any[] = [];
  arrayImages: any[] = [];
  priceOfert: number = 0;
  idImgEdit: string = "";
  theRoute: string = "";
  fullName: string = "";
  priceAux: string = "";
  typeDni: string = "V";
  codePhone: string = "";
  email: string = "";
  phone: string = "";
  price: number = 0;
  myId: string = "";
  dni: string = "";
  id: string = "";
  aux: number = 0;
  km: string = "";
  me: any = null;

  invalidCodePhone: boolean = false;
  invalidPhoneNumber: boolean = false;
  emptyPhoneNumber: boolean = false;
  emptyName: boolean = false;
  typeDoc: boolean = false;
  emptyDni: boolean = false;
  emptyPrice: boolean = false;

  @ViewChild('actionSheetEdit') actionSheetEdit!: IonActionSheet;
  @ViewChild('actionSheet') actionSheet!: IonActionSheet;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('modalBuy') modal!: IonModal;
  @ViewChild('autoComplete') autoComplete!: IonPopover;

  constructor(private router:Router, private menu: MenuController, private utils: UtilsService, private actRoute: ActivatedRoute, private sellerSrv: SellerService, private zone: NgZone, private authSrv: AuthService) {
    this.id = this.actRoute.snapshot.params['id'];
    this.theRoute = this.actRoute.snapshot.params['route'];
    if (this.actRoute.snapshot.params['category'] !== undefined) {

      this.theCartegory = this.actRoute.snapshot.params['category'];
    }

    if (this.utils.isApp()) {
      this.typeConection = true;
    }

    this.carDetail._id = "";
    this.carDetail.model = "";
    this.carDetail.brand = "";
    this.carDetail.year = 0;
    this.carDetail.displacement = "";
    this.carDetail.km = 0;
    this.carDetail.engine_model = "";
    this.carDetail.titles = "";
    this.carDetail.fuel = "";
    this.carDetail.transmission = "";
    this.carDetail.traction = "";
    this.carDetail.city = "";
    this.carDetail.dealer = "";
    this.carDetail.concesionary = "";
    this.carDetail.traction_control = "";
    this.carDetail.performance = "";
    this.carDetail.price = 0;
    this.carDetail.comfort = "";
    this.carDetail.technology = "";
    this.carDetail.id_seller = "";
    this.carDetail.id_mechanic = "";
    this.carDetail.id_seller_buyer = "";
    this.carDetail.mechanicalFile = false;
    this.carDetail.sold = false;
    this.carDetail.images = [];
    this.carDetail.imgs_documentation = [];
    this.carDetail.vin = "";
    this.carDetail.vehicle_plate = "";
    this.carDetail.price_ofert = 0;

    this.me = this.authSrv.getMeData();
    if (this.me !== null) {
      this.myId = this.me.id_sell;
    }

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getVehicleById();
    this.buttonsActionSheet();
    this.buttonsActionSheetEdit();
    this.getBrands();
  }

  goBack(){

    if(this.theRoute == "home-seller"){
      this.router.navigate(['seller']);
    }else if(this.theRoute == "myvehicles"){
      this.router.navigate(['my-vehicles']);
    }else if (this.theRoute == "graphics") {
      this.router.navigate(['graphics']);
    }else{
      this.router.navigate(['buy-car']);
    }

  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getVehicleById(){
    let data = {
      id: this.id
    }
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.vehicleById(data).subscribe((data:any) => {

      if(data.status){
        this.carDetail = data.data;
        this.km = JSON.stringify(this.setDot(this.carDetail.km));
        this.km = this.km.replace('"','');
        this.km = this.km.replace('"','');
        this.utils.dismissLoading();
        
        if (this.carDetail.price !== null) {
          this.price = this.carDetail.price;
          this.priceOfert = this.carDetail.price;
          this.priceOfertAux = this.setDot(this.carDetail.price);
          this.priceAux = this.setDot(this.carDetail.price);
        }

        if(this.carDetail.images.length > 0){
          this.arrayImages = this.carDetail.images;
        }

        if (this.carDetail.imgs_documentation.length > 0) {
          this.arrayDocuments = this.carDetail.imgs_documentation;
        }

      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
    },
    (error:any) => {
      console.log(error);
    });
  }

  public openFile(id_vehicle:any){
    this.router.navigate(['mechanical-file-detail/'+id_vehicle+'/'+this.theRoute]);
  }

  public buyVehicle(){

    if(this.priceOfert == 0 || this.priceOfert == null || this.priceOfert == undefined || this.priceOfert.toString() == ""){
      this.emptyPrice = true;
      return;
    }

    if(this.fullName == "" || this.fullName == null || this.fullName == undefined){
      this.emptyName = true;
      return;
    }
      
    if(this.typeDni == "" || this.typeDni == null || this.typeDni == undefined){
      this.typeDoc = true;
      return;
    }
    
    if(this.dni == "" || this.dni == null || this.dni == undefined){
      this.emptyDni = true;
      return;
    }

    if(this.codePhone == "" || this.codePhone == null || this.codePhone == undefined){
      this.invalidCodePhone = true;
      return; 
    }

    if(this.phone == "" || this.phone == null || this.phone == undefined){
      this.emptyPhoneNumber = true;
      return; 
    }

    if(this.email == "" || this.email == null || this.email == undefined){
      this.emptyEmail = true;
      return;
    }
    return;
    let data = {
      id_vehicle: this.id,
      id_seller: this.myId,
      name_new_owner: this.fullName,
      dni_new_owner: this.typeDni+"-"+this.dni,
      phone_new_owner: this.codePhone+this.phone,
      email_new_owner: this.email,
      price_ofert: this.priceOfert
    }
    this.dismissModal();
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.buyVehicle(data).subscribe((data:any) => {
        
        if(data.status){
          this.utils.presentToast(data.message);
          this.utils.dismissLoading();
          this.router.navigate(['seller']);
        }else{
          this.utils.presentToast(data.message);
        }
    
    }, (error:any) => {
      console.log(error);
    });

  }

  public approveBuyVehicle(){
    let data = {
      id_vehicle: this.id
    }

    this.sellerSrv.approveBuyVehicle(data).subscribe((data:any) => {
          
          if(data.status){
            this.utils.presentToast(data.message);
            this.router.navigate(['seller']);
          }else{
            this.utils.presentToast(data.message);
          }
      
      }, (error:any) => {
        console.log(error);
      }
    );

  }

  public rejectBuyVehicle(){
    let data = {
      id_vehicle: this.id
    }

    this.sellerSrv.rejectBuyVehicle(data).subscribe((data:any) => {
      
      if(data.status){
        this.utils.presentToast(data.message);
        this.router.navigate(['seller']);
      }else{
        this.utils.presentToast(data.message);
      }
  
    }, (error:any) => {
        console.log(error);
    });
  }
  
  public editVehicle(){
    this.editCar=!this.editCar;
  }

  public updateVehicle(){
    
    this.carDetail.km = parseInt(this.km.replace(/\./g,''));
    this.carDetail.price = this.price
    let data = {
      data: this.carDetail
    }
    
    this.sellerSrv.updateVehicle(data).subscribe((data:any) => {
      this.utils.presentLoading("Actualizando...");
      if(data.status){
        this.utils.dismissLoading();
          this.utils.presentToast(data.message);
          this.editCar=false;
          this.editPrice = false;
          this.getVehicleById();
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast(data.message);
        }
    
    }, (error:any) => {
      
      this.utils.dismissLoading();
      this.utils.presentToast("Server error");
    });

  }

  public deleteImage(index:any, image:any){
    this.utils.presentLoading("Eliminando...");
    let data = {
      public_id: image.public_id,
    }
    this.sellerSrv.deleteImageVehicle(data).subscribe((data:any) => {
      this.zone.run(() => {
        this.arrayImages.splice(index,1)
        this.utils.dismissLoading();
      });
    }, (error:any) => {
      console.log(error);
    });

    
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

      this.addNewImage(info);
    }
    reader.readAsDataURL(file[0]);
  }

  public getImage2(file:FileList){
    this.utils.presentLoading("Cargando imagen...");
    let reader = new FileReader();
    reader.onload = (e:any)=>{
      let info = e.target["result"];
      let split = info.split("base64");
      let split2 = split[0].split("/");
      let type = split2[1];
      this.editImgVehicle(info);
    }
    reader.readAsDataURL(file[0]);
  }

  public editImage(index:any, _id:any){
    this.aux = index;
    this.idImgEdit = _id;
    this.fileInput2.nativeElement.click();
  }

  public async takePhoto(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      this.addNewImage(imageData.dataUrl);
    },
    (err)=>{
      console.log(err)
    })
    this.utils.dismissLoading();
  }

  public async takePhotoGalery(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then((imageData)=>{
      this.addNewImage(imageData.dataUrl);
    },
    (err)=>{
      console.log(err)
    })
    this.utils.dismissLoading();
  }

  public async editTakePhoto(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      this.editImgVehicle(imageData.dataUrl);
    },
    (err)=>{
      console.log(err)
    })

    this.utils.dismissLoading();
  }

  public async editTakePhotoGalery(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then((imageData)=>{
      this.editImgVehicle(imageData.dataUrl);
    },
    (err)=>{
      console.log(err)
    })

    this.utils.dismissLoading();
  }

  public openActionSheetEdit(index:any, image:any){

    this.idImgEdit = image.public_id;
    this.aux = index;
    this.actionSheetEdit.present();
  }

  public openActionSheet(){
    this.actionSheet.present();
  }
  
  public addNewImage(image:any){
    let img = {
      id_vehicle: this.id,
      image: image
    }

    this.sellerSrv.addImageVehicle(img).subscribe((data:any) => {
        let newImg = {
          img: data.data.img,
          _id: data.data._id,
          public_id: data.data.public_id
        }

        this.arrayImages.push(newImg);
        this.carDetail.images.push(newImg);
        this.utils.dismissLoading();
    });
  }

  public editImgVehicle(image:any){
    let img = {
      id_vehicle: this.id,
      image: image,
      public_id: this.idImgEdit,
    }

    this.sellerSrv.editImageVehicle(img).subscribe((data:any) => {
      let imgAct= data.data.imgEdit;
      this.zone.run(()=>{
        this.carDetail.images = data.data.images;
        for (let i = 0; i < this.arrayImages.length; i++) {
          if (this.arrayImages[i].public_id === this.idImgEdit) {
            this.arrayImages[i].img = imgAct.img;
          }
        }
        this.utils.dismissLoading();
      })
    });
  }

  public dismissModal(){
    this.modal.dismiss();
  }

  public openModalBuy(){
    this.modal.present();
  }

  public dotPrice(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.priceAux = num;
      this.price = input.value.replace(/\./g,'');
    }else{ 
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotPriceOfert(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.priceOfertAux = num;
      this.priceOfert = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public setDot(numb:any){
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return str.join(".");
  }

  public buttonsActionSheet(){
    this.actionSheetButtons = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.takePhoto();
        }
      },
      {
        text: 'Galería',
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
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.editTakePhoto();
        }
      },
      {
        text: 'Galería',
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

  public dispatched(){
    this.utils.presentLoading("Actualizando vehículo...");
    let data = {
      id: this.id,
      final_price_sold: this.carDetail.final_price_sold,
    }
      this.sellerSrv.dispatched(data).subscribe((data:any)=>{

        if (data.status) {
          this.utils.presentToast("Vehículo entregado");
          this.utils.dismissLoading();
          this.getVehicleById();
        }else{
          this.utils.presentToast("Error al entregar vehículo");
          this.utils.dismissLoading();
        }
    }
    ,(err)=>{
      console.log(err)
      this.utils.presentToast("Error al entregar vehículo");
      this.utils.dismissLoading();
    })
  }

  public repost(){
    this.utils.presentLoading("Actualizando vehículo...");
    let data = {
      id: this.id,
    }

    this.sellerSrv.repost(data).subscribe((data:any)=>{
      if (data.status) {
        this.utils.presentToast("Vehículo publicado Exitosamente");
        this.utils.dismissLoading();
      }else{
        this.utils.presentToast("Error al publicar vehículo");
        this.utils.dismissLoading();
      }
    }
    ,(err)=>{
      console.log(err)
      this.utils.presentToast("Error al publicar vehículo");
      this.utils.dismissLoading();
    })
  }

  public searchAutoComplete(){
    this.showAutoComplete = true;
    this.getAutoComplete(); 
  }

  public getAutoComplete(){

    let data = {
      search: this.carDetail.model
    }

    this.sellerSrv.autoComplete(data).subscribe((res:any)=>{
      if (res.status) {
        this.arrayAutoComplete = res.data;
      }
    })
  }

  public selectAutoComplete(item:any){
    this.carDetail.model = item.model;
    this.carDetail.brand = item.brand;
    this.carDetail.type_vehicle = item.type_vehicle;
    this.arrayAutoComplete = [];
    this.showAutoComplete = false;
  }
  
  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res: any) => {
        this.arrayBrands = res.data;

      }, (err: any) => {
        console.log(err);
      });

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

  public validEmail(event:any){
    if (event.detail.value !== '') {
      this.emptyEmail=false;
      if (!this.utils.validateEmail(event.detail.value)) {
        this.invalidEmail=true;
      }else{
        this.invalidEmail=false;
      }
    }
  }

  public validPhone(event:any){
    if (event.detail.value !== '') {
      this.emptyPhoneNumber=false;
      if (event.detail.value.length < 7) {
        this.invalidPhoneNumber=true;
      }else{
        this.invalidPhoneNumber=false;
      }
    }
  }

  public validCodePhone(event:any){
    if (event.detail.value !== '') {
      this.invalidCodePhone=false;
    }else{
      this.invalidCodePhone=true;
    }
  }

  public validName(event:any){
    if (event.detail.value !== '') {
      this.emptyName=false;
    }else{
      this.emptyName=true;
    }
  }

  public validDni(event:any){
    if (event.detail.value !== '') {
      this.emptyDni=false;
    }else{
      this.emptyDni=true;
    }
  }

  public validTypeDni(event:any){

    console.log(event)
    if (event.detail.value !== '') {
      this.typeDoc=false;
    }else{
      this.typeDoc=true;
    }
  }

  public onEditPrice(){
    this.editPrice = true;
  }


}
