import { Routes } from '@angular/router';
import { ImpressumComponent } from './impressum/impressum/impressum.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy/privacy-policy.component';
import { HelpComponent } from './help/help.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ContactsListComponent } from './main-content/contacts/contacts-list/contacts-list.component';
import { ContactsComponent } from './main-content/contacts/contacts.component';

export const routes: Routes = [
    { path: '', component: MainContentComponent},
    { path: 'imprint', component: ImpressumComponent},
    { path: 'privacy-policy', component: PrivacyPolicyComponent},
    { path: 'help-page', component: HelpComponent},
    { path: 'contact-list', component: ContactsListComponent},
    { path: 'contact', component: ContactsComponent},
];
