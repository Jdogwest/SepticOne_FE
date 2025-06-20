import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ourServicesDescriptions } from '@/main-page/constants/our-services-descriptions';

@Component({
  selector: 'app-our-services',
  imports: [CommonModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.scss',
})
export class OurServicesComponent {
  protected readonly oddDescriptions = ourServicesDescriptions.filter(
    (item) => item.id % 2 !== 0
  );
  protected readonly evenDescriptions = ourServicesDescriptions.filter(
    (item) => item.id % 2 === 0
  );
  protected readonly allDescriptions = [...ourServicesDescriptions].sort(
    (a, b) => a.id - b.id
  );
}
