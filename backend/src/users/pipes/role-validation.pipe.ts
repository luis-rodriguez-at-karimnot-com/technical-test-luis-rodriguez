import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class RoleValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value && !['Admin', 'User'].includes(value)) {
      throw new BadRequestException(`Invalid role: ${value}. Allowed values are 'Admin' or 'User'.`);
    }
    return value;
  }
}