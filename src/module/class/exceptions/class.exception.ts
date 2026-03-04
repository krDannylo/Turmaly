import { HttpStatus } from '@nestjs/common';
import { DomainError } from 'src/common/errors/domain.error';

export class ClassNameConflictException extends DomainError {
  constructor() {
    super('Classroom already exist', HttpStatus.CONFLICT, 'CLASS_NAME_CONFLICT');
  }
}

export class ClassNotFoundException extends DomainError {
  constructor() {
    super('Classroom not found', HttpStatus.NOT_FOUND, 'CLASS_NOT_FOUND');
  }
}

export class EnrollmentCodeNotFoundException extends DomainError {
  constructor() {
    super('Code not found', HttpStatus.NOT_FOUND, 'ENROLLMENT_CODE_NOT_FOUND');
  }
}

export class EnrollmentCodeConflictException extends DomainError {
  constructor() {
    super('Code already exist', HttpStatus.CONFLICT, 'ENROLLMENT_CODE_CONFLICT');
  }
}

export class InvalidEnrollmentCodeException extends DomainError {
  constructor() {
    super('Code expired', HttpStatus.BAD_REQUEST, 'ENROLLMENT_CODE_INVALID');
  }
}

export class ExpiredEnrollmentCodeException extends DomainError {
  constructor() {
    super('Date to expire code invalid', HttpStatus.BAD_REQUEST, 'ENROLLMENT_CODE_EXPIRED_DATE_INVALID');
  }
}