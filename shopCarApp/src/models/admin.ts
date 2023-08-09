export class CreateSeller {
  public email!: string;
  public password!: string;
  public password_confirm!: string;
  public username!: string;
  public fullName!: string;
  public city!: string;
  public phone!: string;
  public concesionary!: string;
}

export class SellersList{
  public _id!: string;
  public id_seller!: string;
  public id_user!: string;
  public email!: string;
  public username!: string;
  public fullName!: string;
  public city!: string;
  public concesionary!: string;
  public phone!: string;
  public type_user: string = "seller";
}

