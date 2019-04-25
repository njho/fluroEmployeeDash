import { Moment } from 'moment';

export interface IUser {
  username: string;
  email: string;
  passwordOne: string;
  passwordTwo: string;
  isAdmin: string;
  error: object;
}

export interface IRootState {
  company: ICompanyInfo;
  user: IUser;
  zones: IZoneState;

  subscription?: ICompanySubscription;
}

export interface Company {
  name: string;
  phoneNumber: number;
  logoUrl: string;
  companyId: string;
}

export interface ICompanyInfo {
  company: ICompany;
  zones: IEditZone[];
  employees: ICompanyEmployee[];
  creditCards: ICompanyCreditCards[];
  subscription: ICompanySubscription;
}
export interface ICompany {
  name: null;
  phoneNumber: null;
  logoUrl: null;
  companyId: null;
  employeeDollars: number;
  employeeQuantity: number;
  fleetDollars: number;
  fleetQuantity: number;
  subscriptionAmount: number;
}

export interface ICompanyCreditCard {
  number: number;
  expMonth: number;
  expYear: number;
}
