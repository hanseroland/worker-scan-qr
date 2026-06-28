//infrastructure/Repositories
import {MysqlCompanyRepository} from './src/infrastructure/database/repositories/MysqlCompanyRepository';
import {MysqlEmployeeInvitationRepository} from './src/infrastructure/database/repositories/MysqlEmployeeInvitationRepository';
import {MysqlEmployeeRepository} from './src/infrastructure/database/repositories/MysqlEmployeeRepository';
import {MysqlLocationRepository} from './src/infrastructure/database/repositories/MysqlLocationRepository';
import {MysqlPointageEventRepository} from './src/infrastructure/database/repositories/MysqlPointageEventRepository';
import {MysqlQRCodeRepository} from './src/infrastructure/database/repositories/MysqlQRCodeRepository';
import {MysqlRefreshTokenRepository} from './src/infrastructure/database/repositories/MysqlRefreshTokenRepository';
import {MysqlUserRepository} from './src/infrastructure/database/repositories/MysqlUserRepository';

//infrastructure/services
import {BcryptPasswordService} from './src/infrastructure/services/BcryptPasswordService'
import {CryptoService} from './src/infrastructure/services/CryptoService'
import {EmailService} from './src/infrastructure/services/EmailService'
import {JwtTokenService} from './src/infrastructure/services/JwtTokenService'
import {UploadService} from './src/infrastructure/services/UploadService'

//applications/use-cases
import { ActivationAccountUseCase } from './src/application/use-cases/auth/ActivateAccountUseCase';
import { ForgotPasswordUseCase } from './src/application/use-cases/auth/ForgotPasswordUseCase';
import { LoginUseCase } from './src/application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from './src/application/use-cases/auth/RefreshTokenUseCase';
import { RegisterUserUseCase } from './src/application/use-cases/auth/RegisterUserUseCase';
import { ResetPasswordUseCase } from './src/application/use-cases/auth/ResetPasswordUseCase';

import { CreateCompanyUseCase } from './src/application/use-cases/company/CreateCompanyUseCase';
import { DeleteCompanyUseCase } from './src/application/use-cases/company/DeleteCompanyUseCase';
import { GetAllCompaniesUseCase } from './src/application/use-cases/company/GetAllCompaniesUseCase';
import { GetCompanyUseCase } from './src/application/use-cases/company/GetCompanyUseCase';
import { UpdateCompanyUseCase } from './src/application/use-cases/company/UpdateCompanyUseCase';
import { UploadCompanyLogoUseCase } from './src/application/use-cases/company/UploadCompanyLogoUseCase';

import { CreateEmployeeUseCase } from './src/application/use-cases/employee/CreateEmployeeUseCase';
import { DesactivateEmployeeUseCase } from './src/application/use-cases/employee/DesactivateEmployeeUseCase';
import { GetAllEmployeesUseCase } from './src/application/use-cases/employee/GetAllEmployeesUseCase';
import { GetEmployeeUseCase } from './src/application/use-cases/employee/GetEmployeeUseCase';
import { UpdateEmployeeUseCase } from './src/application/use-cases/employee/UpdateEmployeeUseCase';
import { UploadEmployeePictureUseCase } from './src/application/use-cases/employee/UploadEmployeePictureUseCase';

import { AcceptInvitationUseCase } from './src/application/use-cases/EmployeeInvitation/AcceptInvitationUseCase';
import { CreateInvitationUseCase } from './src/application/use-cases/EmployeeInvitation/CreateInvitationUseCase';

import { CreateLocationUseCase } from './src/application/use-cases/location/CreateLocationUseCase';
import { DeleteLocationUseCase } from './src/application/use-cases/location/DeleteLocationUseCase';
import { GetAllLocationsUseCase } from './src/application/use-cases/location/GetAllLocationsUseCase';
import { GetLocationUseCase } from './src/application/use-cases/location/GetLocationUseCase';
import { UpdateLocationUseCase } from './src/application/use-cases/location/UpdateLocationUseCase';

import { CreatePointageEventUseCase } from './src/application/use-cases/PointageEvent/CreatePointageEventUseCase';
import { GetPointageEventsByEmployeeUseCase } from './src/application/use-cases/PointageEvent/GetPointageEventsByEmployeeUseCase';

import { DeleteUserUseCase } from './src/application/use-cases/user/DeleteUserUseCase';
import { GetCompanyUsersUseCase } from './src/application/use-cases/user/GetCompanyUsersUseCase';
import { GetUserUseCase } from './src/application/use-cases/user/GetUserUseCase';
import { UpdateUserUseCase } from './src/application/use-cases/user/UpdateUserUseCase';

import { GenerateQRCodeUseCase } from './src/application/use-cases/QRCode/GenerateQRCodeUseCase';
import { RotateQRCodeUseCase } from './src/application/use-cases/QRCode/RotateQRCodeUseCase';
import { ValidateQRCodeUseCase } from './src/application/use-cases/QRCode/ValidateQRCodeUseCase';

//interface/http/controllers
import { AuthController } from './src/interfaces/http/controllers/AuthController';
import { CompanyController } from './src/interfaces/http/controllers/CompanyController';
import { EmployeeController } from './src/interfaces/http/controllers/EmployeeController';
import { EmployeeInvitationController } from './src/interfaces/http/controllers/EmployeeInvitationController';
import { LocationController } from './src/interfaces/http/controllers/LocationController';
import { PointageEventController } from './src/interfaces/http/controllers/PointageEventController';
import { QRCodeController } from './src/interfaces/http/controllers/QRCodeController';
import { UserController } from './src/interfaces/http/controllers/UserController';




//repositories
const companyRepository = new MysqlCompanyRepository()
const employeeInvitationRepository = new MysqlEmployeeInvitationRepository()
const employeeRepository = new MysqlEmployeeRepository()
const locationRepository = new MysqlLocationRepository()
const pointageEventRepository = new MysqlPointageEventRepository()
const qrCodeRepository = new MysqlQRCodeRepository()
const refreshTokenRepository = new MysqlRefreshTokenRepository()
const userRepository = new MysqlUserRepository()


//services
const bcryptPasswordService = new BcryptPasswordService()
const cryptoService = new CryptoService()
const emailService = new EmailService()
export const jwtTokenService = new JwtTokenService()
const uploadService = new UploadService()


//use-cases
const activationAccountUseCase = new ActivationAccountUseCase(userRepository, cryptoService)
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, cryptoService, emailService)
const loginUseCase = new LoginUseCase(userRepository, bcryptPasswordService, jwtTokenService, refreshTokenRepository, cryptoService)
const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, userRepository, cryptoService, jwtTokenService)
const registerUserUseCase = new RegisterUserUseCase(userRepository, bcryptPasswordService, cryptoService, emailService)
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, cryptoService, bcryptPasswordService)

const createCompanyUseCase = new CreateCompanyUseCase(companyRepository)
const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepository)
const getAllCompaniesUseCase = new GetAllCompaniesUseCase(companyRepository)
const getCompanyUseCase = new GetCompanyUseCase(companyRepository)
const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository)
const uploadCompanyLogoUseCase = new UploadCompanyLogoUseCase(companyRepository, uploadService)

const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, companyRepository, emailService)
const deactivateEmployeeUseCase = new DesactivateEmployeeUseCase(employeeRepository)
const getAllEmployeesUseCase = new GetAllEmployeesUseCase(employeeRepository)
const getEmployeeUseCase = new GetEmployeeUseCase(employeeRepository)
const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository)
const uploadEmployeePictureUseCase = new UploadEmployeePictureUseCase(employeeRepository, uploadService)

const acceptInvitationUseCase = new AcceptInvitationUseCase(employeeInvitationRepository,cryptoService)
const createInvitationUseCase = new CreateInvitationUseCase(employeeInvitationRepository, employeeRepository, cryptoService, emailService, companyRepository)

const createLocationUseCase = new CreateLocationUseCase(locationRepository)
const deleteLocationUseCase = new DeleteLocationUseCase(locationRepository)
const getAllLocationsUseCase = new GetAllLocationsUseCase(locationRepository)
const getLocationUseCase = new GetLocationUseCase(locationRepository)
const updateLocationUseCase = new UpdateLocationUseCase(locationRepository)


const deleteUserUseCase = new DeleteUserUseCase(userRepository)
const getCompanyUsersUseCase = new GetCompanyUsersUseCase(userRepository)
const getUserUseCase = new GetUserUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)

const generateQRCodeUseCase = new GenerateQRCodeUseCase(qrCodeRepository, locationRepository, cryptoService)
const rotateQRCodeUseCase = new RotateQRCodeUseCase(generateQRCodeUseCase)
const validateQRCodeUseCase = new ValidateQRCodeUseCase(qrCodeRepository, locationRepository)


const createPointageEventUseCase = new CreatePointageEventUseCase(pointageEventRepository, employeeRepository, validateQRCodeUseCase)
const getPointageEventsByEmployeeUseCase = new GetPointageEventsByEmployeeUseCase(pointageEventRepository, employeeRepository)


//controllers 
 const authController = new AuthController(
	activationAccountUseCase,
	forgotPasswordUseCase,
	loginUseCase,
	refreshTokenUseCase,
	registerUserUseCase,
	resetPasswordUseCase
)

 const companyController = new CompanyController(
	createCompanyUseCase,
	getCompanyUseCase,
	getAllCompaniesUseCase,
	updateCompanyUseCase,
	deleteCompanyUseCase,
	uploadCompanyLogoUseCase
)

 const employeeController = new EmployeeController(
	createEmployeeUseCase,
	deactivateEmployeeUseCase,
	getEmployeeUseCase,
	getAllEmployeesUseCase,
	updateEmployeeUseCase,
	uploadEmployeePictureUseCase
)

 const employeeInvitationController = new EmployeeInvitationController(
	acceptInvitationUseCase,
	createInvitationUseCase
)

 const locationController = new LocationController(
	createLocationUseCase,
	getLocationUseCase,
	getAllLocationsUseCase,
	updateLocationUseCase,
	deleteLocationUseCase
)

 const pointageEventController = new PointageEventController(
	createPointageEventUseCase,
	getPointageEventsByEmployeeUseCase
)

 const qrCodeController = new QRCodeController(
	generateQRCodeUseCase,
	rotateQRCodeUseCase,
	validateQRCodeUseCase
)

 const userController = new UserController(
	getCompanyUsersUseCase,
	getUserUseCase,
	updateUserUseCase,
	deleteUserUseCase
)


export const controllers = {
  authController,
  companyController,
  employeeController,
  employeeInvitationController,
  locationController,
  pointageEventController,
  qrCodeController,
  userController
}

// Type utilitaire pour le typage ailleurs (routes/index.ts)
export type Controllers = typeof controllers

