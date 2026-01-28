
export interface Employee {
  unit: string;
  serial: string;
  fullName: string;
  jobTitle: string;
}

export interface PersonnelData {
  units: string[];
  employees: Employee[];
}
