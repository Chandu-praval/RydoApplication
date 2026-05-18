export interface ILoginFormData {
  EmailId: string,
  Password: string,
  ConfirmPassword?: string;
}
export interface ILoginFormErrors {
  EmailId?: string;
  Password?: string;
  ConfirmPassword?: string;
}