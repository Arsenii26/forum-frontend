export class PasswordRenewDto {

  oldPassword: string = '';

  password: string = '';

  confirmPassword: string = '';

  constructor(
    oldPassword: string,
    password: string,
    confirmPassword: string
  ) {}

}
