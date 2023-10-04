"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_schema_1 = __importDefault(require("../schemas/Users.schema"));
class Jwt {
    constructor() {
        this.secretKey = "totoya.app.123456789.2024.regional";
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secretKey);
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secretKey);
    }
    getAuthorization(token, user_type) {
        return __awaiter(this, void 0, void 0, function* () {
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
                let user;
                user = yield Users_schema_1.default.findOne({ _id: dataDecode.id });
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
                    }
                    else {
                        issue = 1;
                        break;
                    }
                }
            }
            if (issue > 0) {
                this.message = "Invalid user";
                this.code = 500;
                return false;
            }
            return this.data = dataDecode;
        });
    }
    decodesAndAuthorizes(token) {
        let arrayReturn = {};
        if (!token) {
            throw new Error("Invalid token supplied.");
        }
        try {
            let decode = this.verifyToken(token);
            arrayReturn = {
                success: true,
                decode_token: decode,
            };
        }
        catch (error) {
            arrayReturn = {
                success: false,
                decode_token: null,
            };
        }
        return arrayReturn;
    }
}
exports.default = new Jwt();
//# sourceMappingURL=generar-jwt.js.map