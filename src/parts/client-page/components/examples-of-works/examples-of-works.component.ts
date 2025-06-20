import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { examplesOfWorks } from '@/main-page/constants/examples-of-works';

@Component({
  selector: 'app-examples-of-works',
  imports: [CommonModule],
  templateUrl: './examples-of-works.component.html',
  styleUrl: './examples-of-works.component.scss',
})
export class ExamplesOfWorksComponent {
  protected readonly works = examplesOfWorks;
}
