import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonModal, MenuController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { CarDetailSeller } from 'src/models/sellet';
import * as global from '../../models/global';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
})
export class CarDetailPage implements OnInit {
  carDetail: CarDetailSeller = new CarDetailSeller();
  actionSheetButtonsEdit: any[] = [];
  typeConection: boolean = false;
  actionSheetButtons: any[] = [];
  openASEdit: boolean = false;
  priceOfertAux: string = "";
  theCartegory: string = "";
  editCar: boolean = false;
  arrayImages: any[] = [];
  priceOfert: number = 0;
  idImgEdit: string = "";
  theRoute: string = "";
  fullName: string = "";
  priceAux: string = "";
  typeDni: string = "V";
  email: string = "";
  phone: string = "";
  price: number = 0;
  myId: string = "";
  dni: string = "";
  id: string = "";
  aux: number = 0;
  urlImg: string = global.urlImgvehicles;


  @ViewChild('ActionSheetEdit') ActionSheetEdit: any;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('modalBuy') modal!: IonModal;

  constructor(private router:Router, private menu: MenuController, private utils: UtilsService, private actRoute: ActivatedRoute, private sellerSrv: SellerService, private zone: NgZone) {
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
    this.carDetail.vin = "";
    this.carDetail.vehicle_plate = "";
    this.carDetail.price_ofert = 0;

    let data = localStorage.getItem('me');

    if(data){
      let dataJson = JSON.parse(data);
      this.myId = dataJson.id_sell;
    }

    this.getVehicleById();

  }


  ngOnInit() {
  }

  goBack(){

    if(this.theRoute == "home-seller"){
      this.router.navigate(['seller']);
    }else if(this.theRoute == "myvehicles"){
      this.router.navigate(['my-vehicles']);
    }else{
      this.router.navigate(['buy-car/'+this.theCartegory]);
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
        console.log(data);
        this.carDetail = data.data;
        this.utils.dismissLoading();
        
        if (this.carDetail.price !== null) {
          this.price = this.carDetail.price;
          this.priceOfert = this.carDetail.price;
          this.priceOfertAux = this.setDot(this.carDetail.price);
        }

        if(this.carDetail.images.length > 0){
          this.arrayImages = this.carDetail.images;
        }

      }else{
        this.utils.presentToast(data.message);
      }
    });
  }

  public openFile(id_vehicle:any){
    this.router.navigate(['mechanical-file-detail/'+id_vehicle+'/'+this.theRoute]);
  }

  public buyVehicle(){

    if(this.priceOfert == 0 || this.priceOfert == null || this.priceOfert == undefined || this.priceOfert.toString() == ""){
      this.utils.presentToast("Ingrese un precio de oferta");
      return;
    }

    if(this.fullName == "" || this.fullName == null || this.fullName == undefined){
      this.utils.presentToast("Ingrese su nombre del nuevo propierario");
      return;
    }
      
    if(this.typeDni == "" || this.typeDni == null || this.typeDni == undefined){
      this.utils.presentToast("Seleccione un tipo de cedula");
      return;
    }
    
    if(this.dni == "" || this.dni == null || this.dni == undefined){
      this.utils.presentToast("Ingrese numero de cedula del nuevo propierario");
      return;
    }

    if(this.phone == "" || this.phone == null || this.phone == undefined){
      this.utils.presentToast("Ingrese numero de telefono del nuevo propierario");
      return; 
    }

    if(this.email == "" || this.email == null || this.email == undefined){
      this.utils.presentToast("Ingrese correo electronico del nuevo propierario");
      return;
    }

    let data = {
      id_vehicle: this.id,
      id_seller: this.myId,
      name_new_owner: this.fullName,
      dni_new_owner: this.typeDni+"-"+this.dni,
      phone_new_owner: this.phone,
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
            console.log(data);
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
        console.log(data);
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
    this.utils.presentLoading("Actualizando...");
    let data = {
      id_vehicle: this.id,
      price: this.price,
      images: this.arrayImages.length > 0 ? this.arrayImages : []
    }
    
    this.sellerSrv.updateVehicle(data).subscribe((data:any) => {
      
      if(data.status){
          console.log(data);
          this.utils.dismissLoading();
          this.utils.presentToast(data.message);
          this.editCar=!this.editCar;
          this.getVehicleById();
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast(data.message);
        }
    
    }, (error:any) => {
      console.log(error);
    });

  }

  public deleteImage(index:any, image:any){
    this.utils.presentLoading("Eliminando...");
    let data = {
      public_id: image.public_id,
    }
    console.log(data);
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
    console.log(this.aux);
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
  
  public addNewImage(image:any){
    let img = {
      id_vehicle: this.id,
      image: image
    }

    this.sellerSrv.addImageVehicle(img).subscribe((data:any) => {
      console.log(data)
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
  
}
