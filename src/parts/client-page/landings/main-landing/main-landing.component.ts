import { Component, signal } from '@angular/core';
import { AboutUsComponent } from '@/main-page/components/about-us/about-us.component';
import { PreviewBlockComponent } from '@/main-page/components/preview-block/preview-block.component';
import { WhyUsComponent } from '@/main-page/components/why-us/why-us.component';
import { OurServicesComponent } from '@/main-page/components/our-services/our-services.component';
import { ExamplesOfWorksComponent } from '@/main-page/components/examples-of-works/examples-of-works.component';
import { ContactsComponent } from '@/main-page/components/contacts/contacts.component';
import { ContactFormComponent } from '@/main-page/forms/contact-form/contact-form.component';

@Component({
  selector: 'app-main-landing',
  imports: [
    PreviewBlockComponent,
    AboutUsComponent,
    WhyUsComponent,
    OurServicesComponent,
    ExamplesOfWorksComponent,
    ContactsComponent,
    ContactFormComponent,
  ],
  templateUrl: './main-landing.component.html',
  styleUrl: './main-landing.component.scss',
})
export class MainLandingComponent {}
