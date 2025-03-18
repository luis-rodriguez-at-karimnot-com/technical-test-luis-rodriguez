import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class StatusValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value && !['Active', 'Inactive'].includes(value)) {
      throw new BadRequestException(`Invalid status: ${value}. Allowed values are 'Active' or 'Inactive'.`);
    }
    return value;
  }
}