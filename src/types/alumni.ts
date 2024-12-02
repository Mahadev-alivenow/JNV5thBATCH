export interface Occupation {
  field: string;
  subField: string;
}

export interface AlumniData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  occupation: Occupation;
  profilePicture?: string;
  message?: string;
  attendingMeet: 'Yes' | 'No';
}

export type AlumniList = AlumniData[];