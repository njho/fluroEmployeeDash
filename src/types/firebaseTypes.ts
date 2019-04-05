export interface IAuthUser {
  customClaims: {
    aud: string;
    companyId: string;
    companyType: string;
    email: string;
    email_verified: boolean;
    exp: number;
    iat: number;
    isPartOfCompany: boolean;
    role: string;
    user_id: string;
  };
  email: string;
  uid: string;
}

export type Context = {
  params: { [key: string]: string | null };
};

export interface IDoc<T> {
  data: () => T;
  id: string;
  docId?: string;
  exists: boolean;
  [key: string]: any;
}

export interface IReq<T> {
  body: T;
}

export interface ISnapshot<T> extends Array<T> {
  size: number;
  forEach: (item: object) => T;
}
