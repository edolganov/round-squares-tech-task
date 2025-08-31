import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';

export async function validateValue(
  value: string,
  validatorClass: new () => ValidatorConstraintInterface,
  propertyName: string = 'value',
): Promise<string | undefined> {
  const validator = new validatorClass();
  const args: ValidationArguments = {
    property: propertyName,
    value: value,
    object: {},
    constraints: [],
    targetName: '',
  };

  const isValid = await validator.validate(value, args);

  if (!isValid) {
    return validator.defaultMessage?.(args) || `Invalid ${propertyName} with value ${value}`;
  }

  return undefined;
}

export function msgValueMustBeIn(values: readonly any[]) {
  return `Value must be one of: ${values.join(', ')}`;
}
