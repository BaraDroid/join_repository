import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Auth, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';

/**
 * SidebarComponent is responsible for rendering the sidebar in the application.
 * It provides the navigation links for different sections of the app and manages the 
 * user's authentication state.
 * 
 * @component
 * @example
 * // Example usage of SidebarComponent in an Angular application
 * <app-sidebar></app-sidebar>
 */
@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  /**
   * The index of the currently selected menu item.
   * This value is used to highlight the active item in the sidebar.
   * 
   * @type {number | null}
   */
  selectedIndex: number | null = null;

  /**
   * The index of the currently selected menu item on mobile devices.
   * 
   * @type {number | null}
   */
  selectedMobileIndex: number | null = null;

  /**
   * The URL of the previously visited page.
   * 
   * @type {string | null}
   */
  previousUrl: string | null = null;

  /**
   * Flag indicating whether the user is logged in.
   * 
   * @type {boolean}
   */
  isLoggedIn: boolean = false;

  /**
   * Authentication service injected into the component.
   * 
   * @type {Auth}
   */
  auth = inject(Auth);

  /**
   * The list of menu items in the sidebar.
   * Each item contains a label, an icon, and a link.
   * 
   * @type {Array<{ label: string, icon: string, link: string }>}
   */
  menuItems = [
    { label: 'Summary', icon: 'assets/sidebar/summary.svg', link: '/summary', fragment: 'summaryUpstairs' },
    { label: 'Add Task', icon: 'assets/sidebar/add-task.svg', link: '/add-task', fragment: 'addTaskUpstairs' },
    { label: 'Board', icon: 'assets/sidebar/board.svg', link: '/board', fragment: 'boardUpstairs' },
    { label: 'Contacts', icon: 'assets/sidebar/contacts.svg', link: '/contact', fragment: 'contactUpstairs' }
  ];

  /**
   * Creates an instance of SidebarComponent.
   * 
   * @param {Router} router - The Angular Router service used to navigate within the app.
   * @param {AppComponent} appComponent - The app's main component, used for logging out.
   */
  constructor(private router: Router, private appComponent: AppComponent) {}

  /**
   * Lifecycle hook that runs when the component is initialized.
   * It listens for authentication state changes and router events.
   */
  ngOnInit() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.isLoggedIn = !!user;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveIndex(event.urlAfterRedirects);
      }
    });
  }

  /**
   * Updates the selected index based on the current URL.
   * 
   * @param {string} currentUrl - The current URL after redirection.
   */
  private updateActiveIndex(currentUrl: string) {
    const foundIndex = this.menuItems.findIndex(item => item.link === currentUrl);
    this.selectedIndex = foundIndex !== -1 ? foundIndex : null;
  }

  /**
   * Sets the active menu item by index.
   * 
   * @param {number} index - The index of the menu item to set as active.
   */
  setActive(index: number) {
    this.selectedIndex = index;
  }

  /**
   * Sets the active menu item on mobile devices by index.
   * 
   * @param {number} index - The index of the menu item to set as active.
   */
  setMobileActive(index: number) {
    this.selectedMobileIndex = index;
  }

  /**
   * Determines if the sidebar menu should be hidden based on the current route and login state.
   * 
   * @returns {boolean} - True if the menu should be hidden, false otherwise.
   */
  shouldHideMenu(): boolean {
    const hiddenRoutes = ['/privacy-policy', '/imprint'];
    return hiddenRoutes.includes(this.router.url) && !this.isLoggedIn;
  }

  /**
   * Logs the user out by clearing the authentication state.
   * This action will set the user as logged out and update the `isLoggedIn` flag.
   */
  logout() {
    this.auth.signOut().then(() => {
      this.isLoggedIn = false;
    }).catch((error) => {
      console.error(error);
    });
  }

}
