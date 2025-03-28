import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../board/task.interface';
import { Component, EventEmitter, Inject, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { ContactInterface } from '../../contacts/contact-interface';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {
  firebase = inject(FirebaseService);
  currentContact: ContactInterface | null = null;
  todaysDate: string = new Date().toISOString().split('T')[0];
  selectedPriority: string = 'medium';
  dropdownVisible = false;
  checkboxActive = false;
  selectedContacts: ContactInterface[] = []; //dass ich das unten anzeigen kann
  newTaskAdded: boolean = false;
  subtaskInputFocused: boolean = false;
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  subtaskInput: string = ''; // Model für das Eingabefeld
  formSubmitted: boolean = false;
  showAddButton: boolean = true;
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  @Output() dialogStatusOutput = new EventEmitter<boolean>();
  isDialogOpen: boolean = false;
  selectedCategory: string = '';
  categoryDropdownVisible: boolean = false;
  categorySelected: boolean = false;


  newTask: TaskInterface = {
    title: "",
    description: "",
    date: "",
    priority: "",
    assignedToUserId: [],
    status: "todo",
    category: "",
    subtasks: []
  }

  chooseCategory(choosenCategory: string) {
    this.selectedCategory = choosenCategory;
    this.categorySelected = true;
  }

  toggleCategoryDropdown() {
    this.categoryDropdownVisible = !this.categoryDropdownVisible;
  }

  hideCategoryDropdown() {
    this.categoryDropdownVisible = false;
  }

  emitDialogStatus() {
    this.dialogStatusOutput.emit(this.isDialogOpen);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
  hideDropdown() {
    this.dropdownVisible = false;
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

submitForm(ngform: NgForm) {
  this.newTask.category = this.selectedCategory;
  this.newTask.priority = this.selectedPriority;
  this.newTask.assignedToUserId = this.selectedContacts.map(contact => contact.id).filter((id): id is string => id !== undefined); // Add selected contacts' IDs to the task
  this.newTask.subtasks = this.subtasks.map(subtask => ({ subtask: subtask.name, isCompleted: false })); // Add subtasks to the task
  this.formSubmitted = true;
  if (ngform.valid && this.categorySelected) { // Only check if the form is valid
    console.log(this.newTask.category);
      this.firebase.addTaskToData(this.newTask); // Save the task to the database
      this.newTaskAdded = true;
      console.log(this.newTask); // Log the task for debugging
      this. clearFormular(ngform); // Reset the form after submission
      this.selectedContacts = []; // Clear selected contacts
      this.subtasks = []; // Clear subtasks
      this.categorySelected = false;
      this.selectedCategory = '';
      this.formSubmitted = false;
  }
}

  showReport() {
    setTimeout(() => {
      this.newTaskAdded = false;
    }, 5000);
  }

  dismissReport() {    
    this.newTaskAdded = false;
  }

  clearFormular(ngform: NgForm) {
    ngform.reset(); 
    this.selectedPriority = 'medium';
    this.emitDialogStatus();
  }

  assignContact(contact: ContactInterface) {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    if (index === -1) {
      this.selectedContacts.push(contact); // Add contact if not already selected
    } else {
      this.selectedContacts.splice(index, 1); // Remove contact if already selected
    }
  }

  isSelected(contact: any): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
  }

  // submitPrio() {
  //   console.log("Ausgewählte Priorität:", this.selectedPriority);
  // }


  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push({ name: this.subtaskInput.trim(), isEditing: false }); // Subtask zur Liste hinzufügen
      this.subtaskInput = ''; // Eingabefeld leeren
    }
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1); // Subtask entfernen
  }

  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
    setTimeout(() => {
      const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  }

  saveSubtask(index: number) {
    const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
    if (inputElement) {
      this.subtasks[index].name = inputElement.value;
    }
    this.subtasks[index].isEditing = false;
  }
  handleKeyUp(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.saveSubtask(index);
    }
  }

  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskInputFocused = false;
  }

  focusSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.focus();
    }
  }

  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 1000/2); // 2 seconds delay
  }

  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
}


}