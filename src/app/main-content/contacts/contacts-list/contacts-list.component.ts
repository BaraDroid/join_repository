import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { CommonModule } from '@angular/common';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { log } from 'console';
import { loadavg } from 'os';
import { ContactInterface } from '../contact-interface';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  standalone: true,
  imports: [CommonModule, AddContactDialogComponent, EditContactDialogComponent, DeleteDialogComponent],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent {
  firebase = inject(FirebaseService);
  isDialogOpen: boolean = false;
  isDeleteOpen: boolean = false;
  currentContact: ContactInterface | null = null;
  isEditDialogOpen: boolean = false;
  @Output() openDetails = new EventEmitter<ContactInterface>();
  @Output() contactCreated = new EventEmitter<void>();

  @Output() contactCreated = new EventEmitter<void>();



  openDialogDetails(contact: ContactInterface) {
    this.currentContact = contact;
    if (this.currentContact) {
      console.log('ID:', this.currentContact.id);
      console.log('Name:', `${this.currentContact.firstname} ${this.currentContact.lastname}`);
      console.log('Color:', this.currentContact.color);
      this.openDetails.emit(contact);
    }
  }


  openAddNewContacts() {
    this.isDialogOpen = true;
  }

  openEditDialog(index: number) {
    this.isEditDialogOpen = true;
    this.currentContact = this.firebase.orderedContactsList[index];
    if (this.currentContact) {
      console.log('ID:', this.currentContact.id);
      console.log('Name:', `${this.currentContact.firstname} ${this.currentContact.lastname}`);
      console.log('Color:', this.currentContact.color);
    }
  }

  openDeleteContact(index: number) {
    this.isDeleteOpen = true;
  openDeleteContact(index: number) {
    this.isDeleteOpen = true;
    this.currentContact = this.firebase.orderedContactsList[index];
    if (this.currentContact) {
      console.log('ID:', this.currentContact.id);
      console.log('Name:', `${this.currentContact.firstname} ${this.currentContact.lastname}`);
      console.log('Color:', this.currentContact.color);
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      this.isEditDialogOpen = false;
      setTimeout(() => {
        this.isDialogOpen = false;
        this.isDeleteOpen = false;
        this.isDialogOpen = false;
        this.isDeleteOpen = false;
      }, 500);
    } else {
    } else {
      this.isDialogOpen = false;
      this.isDeleteOpen = false;
    }
  }

  onContactCreated(contact: ContactInterface) { 
    this.isDialogOpen = false;
    this.currentContact = contact;
    this.openDetails.emit(contact); 
  }
}