import { HttpStatus } from "@nestjs/common";
import { DomainError } from "../errors/domain.error";

export class InvalidDateException extends DomainError {
  constructor() {
    super('Invalid Date', HttpStatus.BAD_REQUEST, 'INVALID_DATE');
  }
}