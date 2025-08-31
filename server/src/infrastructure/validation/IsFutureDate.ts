import {
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { dateFrom } from '../../common/utils/date/dateFrom';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const date = dateFrom(value);
    return !!date && !isNaN(date.getTime()) && date > new Date();
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in the future`;
  }
}

export const Validate_IsFutureDate = () => Validate(IsFutureDate);
