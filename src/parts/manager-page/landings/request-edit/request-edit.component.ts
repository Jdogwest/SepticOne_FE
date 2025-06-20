import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { RequestFormData } from '@/manager-page/interfaces/request-form.interface';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-request-edit',
  imports: [DatePickerModule, ReactiveFormsModule],
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.scss',
})
export class RequestEditComponent {
  busyDates: Date[] = [
    new Date('2025-06-03'),
    new Date('2025-06-04'),
    new Date('2025-06-05'),
  ];

  requestForm = new FormGroup<FormControlsOf<RequestFormData>>({
    status: new FormControl('none'),
    date: new FormControl(''),
    time: new FormControl('none'),
    brigade: new FormControl('none'),
    comment: new FormControl(''),
  });

  onSave() {
    if (this.requestForm.valid) {
      const formData = this.requestForm.getRawValue();
      console.log('Form Data:', formData);
    }
  }
}
