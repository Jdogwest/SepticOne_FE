export interface Client {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone_number: string;
}

export interface Septic {
  city: string;
  street: string;
  house: string;
  volume: number;
  model: string;
}

export interface UserUpdate {
  client: Client;
  septic: Septic;
}

export interface UserUpdateWithRole extends UserUpdate {
  new_role: string;
}
