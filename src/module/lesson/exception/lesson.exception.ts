import { HttpStatus } from "@nestjs/common";
import { DomainError } from "src/common/errors/domain.error";

export class LessonNotFoundException extends DomainError {
  constructor() {
    super('Lesson not found', HttpStatus.NOT_FOUND, 'LESSON_NOT_FOUND');
  }
}