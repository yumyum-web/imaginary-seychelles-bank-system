//users
export interface Individual {
  id: number;
  NIC: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: number;
  dateOfBirth: Date;
}

export interface Organization {
  id: number;
  name: string;
  type: string;
  address: string;
  phoneNumber: number;
  dateOfIncorporation: Date;
}

export interface Employee {
  id: number;
  NIC: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: number;
  dateOfBirth: Date;
  position: string;
  branchId: number;
  branchName: string;
}
