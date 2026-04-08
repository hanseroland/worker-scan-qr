export interface IEmailService {
  sendWelcomeEmail(to: string, activationToken: string): Promise<void>;
  sendEmployeeCode(
    to: string,
    employeeCode: string,
    companyName: string
  ): Promise<void>;
  sendResetPasswordEmail(to: string, resetToken: string): Promise<void>;
}
