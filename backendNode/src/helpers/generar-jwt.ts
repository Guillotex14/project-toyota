import jwt from "jsonwebtoken";
import Users from "../schemas/Users.schema";

class Jwt {
  private secretKey: string;
  public message: any;
  public code: any;
  public data: any;
  public dataValida: any;

  constructor() {
    this.secretKey = "totoya.app.123456789.2024.regional";
  }

  public generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey);
  }

  public verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }

  public async  getAuthorization(token: string, user_type: any[]) {
    if (!token) {
      this.message = "Token required";
      this.code = 500;
      return false;
    }
    let decode = this.decodesAndAuthorizes(token);
    
    if (decode.success == false) {
      this.message = "Invalid Token";
      this.code = 500;
      return false;
    }
    
    let dataDecode = decode.decode_token;
    
    let issue = 0;
    if (user_type) {
      let user:any;
      user =  await Users.findOne({ _id: dataDecode.id});
      if (!user) {
        this.message = "Non-existent user token";
        this.code = 500;
        return false;
      }
        for (let i = 0; i < user_type.length; i++) {
          const element = user_type[i];
          if (element == user.type_user) {
            issue = 0;
            break;
          } else {
            issue++;
          }
        }
    }

    if (issue > 0) {
      this.message = "Invalid user";
      this.code = 500;
      return false;
    }
  
    return this.data =  dataDecode;
  }


  public decodesAndAuthorizes(token: string) {
    let arrayReturn: any = {};
    if (!token) {
      throw new Error("Invalid token supplied.");
    }
    try {
      let decode = this.verifyToken(token);
      arrayReturn = {
        success: true,
        decode_token: decode,
      };
    } catch (error) {
      arrayReturn = {
        success: false,
        decode_token: null,
      };
    }
    return arrayReturn;
  }
}

export default new Jwt();
