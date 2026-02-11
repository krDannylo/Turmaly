import { randomBytes, randomInt } from "crypto";
import { AccessCodeConfig } from "../config/access-code.config";

export function generateAccessCode(){
    return randomInt(100000, 999999).toString();
}