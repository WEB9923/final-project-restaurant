export class JwtModel {
  sub!: string;
  email!: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'!: 'User' | 'Admin';
  exp!: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string[];
}
