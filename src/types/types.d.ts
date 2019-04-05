import { Moment } from 'moment';

export interface IUser {
  username: string;
  email: string;
  passwordOne: string;
  passwordTwo: string;
  isAdmin: string;
  error: object;
}

export interface IZoneForm {
  location?: {};
  origin: string;
  destination: string;
  duration: string;
  capacity: number;
  schedule: (
    | {
        key: string;
        name: string;
        departure: null | string;
      }
    | {
        key: string;
        name: string;
        departure: undefined | string;
      }
    | {
        name: string;
        departure: undefined | string;
        key?: undefined | string;
      })[];
}

export interface ISchedule {}

export interface ILatLng {
  lat: number;
  lng: number;
}
export type Poly = ILatLng[];

export interface IRootState {
  company: ICompanyInfo;
  user: IUser;
  zones: IZoneState;
  vehicles: IZoneVehicles[];
  editors: {
    editVehicle: ICompanyVehicle;
  };
  subscription?: ICompanySubscription;
}
export interface ICompanySubscription {
  amount: number;
  cycle: string;
}

export interface IZoneVehicle {
  license: string;
  make: string;
  model: string;
  color: string;
  zoneName: string;
  zoneId: string;
}

export interface IZonesState {
  editZone: IEditZone;
}

export interface IEditZone {
  location: {};
  poly: ILatLng[];
  zoneName: string;
  [key: string]: any;
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
  vehicles: ICompanyVehicle[];
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
export interface ICompanyVehicle {
  docId?: string;
  license: string;
  model: string;
  make: string;
  color: string;
}

export interface ICompanyEmployee {
  docId?: string;
  displayName: string;
  email: string;
  firstName: string;
  isPartOfCompany: boolean;
  lastName: string;
  role: string;
}
