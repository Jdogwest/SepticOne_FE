import { FormControl } from '@angular/forms';

export interface loginFormInterface {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface registrationFormInterface {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  repeatPassword: FormControl<string | null>;
  surname: FormControl<string | null>;
  patronymic: FormControl<string | null>;
  name: FormControl<string | null>;
  acceptedAgreement: FormControl<boolean | null>;
}
