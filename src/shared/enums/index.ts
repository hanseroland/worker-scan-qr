export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum PointageType {
  CHECK_IN = 'CHECK_IN',
  BREAK_START = 'BREAK_START',
  BREAK_END = 'BREAK_END',
  CHECK_OUT = 'CHECK_OUT',
}

export enum InvitationType {
  EMAIL = 'EMAIL',
  OTP = 'OTP',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}
