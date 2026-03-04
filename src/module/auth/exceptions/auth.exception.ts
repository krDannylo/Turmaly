import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { DomainError } from 'src/common/errors/domain.error';

export class UserNotFoundException extends DomainError {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND, 'AUTH_USER_NOT_FOUND');
  }
}

export class InvalidCredentialsException extends DomainError {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED, 'AUTH_INVALID_CREDENTIALS');
  }
}

export class InvalidRoleException extends DomainError {
  constructor() {
    super('Invalid role', HttpStatus.BAD_REQUEST, 'AUTH_INVALID_ROLE');
  }
}

export class EmailAlreadyInUseException extends DomainError {
  constructor() {
    super('Email already in use', HttpStatus.CONFLICT, 'AUTH_EMAIL_ALREADY_IN_USE');
  }
}

export class TokenNotFoundException extends UnauthorizedException {
  constructor() {
    super('Token not found');
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super('Access denied');
  }
}