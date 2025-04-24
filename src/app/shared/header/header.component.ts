import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Auth, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';

/**
 * Component for the header of the application.
 * 
 * The {@link HeaderComponent} manages user authentication state, menu toggle, 
 * and renders the user initials based on their profile information.
 * 
 * @example
 * <app-header></app-header>
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  /** Tracks whether the menu is open or closed */
  menuOpen = false;

  /** The initials of the currently logged-in user */
  userInitials: string = '';

  /** The previous URL visited by the user */
  previousUrl: string | null = null;

  /** Tracks the login status of the user */
  isLoggedIn: boolean = false;

  /** Injected Firebase Auth service */
  auth = inject(Auth);

  /**
   * Creates an instance of the {@link HeaderComponent}.
   * 
   * @param router The Angular Router service to navigate between routes.
   * @param appComponent The main {@link AppComponent} to handle global logout actions.
   */
  constructor(private router: Router, private appComponent: AppComponent) {
    this.fetchUserInitials();
  }

  /**
   * Initializes the component and listens for authentication state changes.
   * 
   * It updates the login state based on whether the user is authenticated.
   */
  ngOnInit() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.isLoggedIn = !!user; 
    });
  }

  /**
   * Determines whether the profile container should be hidden based on the current route and login state.
   * 
   * @returns {boolean} `true` if the profile container should be hidden, otherwise `false`.
   * 
   * @example
   * const shouldHide = component.shouldHideProfileContainer();
   */
  shouldHideProfileContainer(): boolean {
    const hiddenRoutes = ['/privacy-policy', '/imprint'];
    return hiddenRoutes.includes(this.router.url) && !this.isLoggedIn;
  }

  /**
   * Fetches the initials of the currently authenticated user.
   * If the user has a display name, it uses the initials from the display name.
   * If no display name exists, it uses the first letter of the email address.
   * 
   * @private
   */
  private fetchUserInitials() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        this.isLoggedIn = true; 
        const displayName = user.displayName || ''; 
        const email = user.email || ''; 

        if (displayName) {
          const [firstName, lastName] = displayName.split(' ');
          const firstInitial = firstName?.charAt(0).toUpperCase() || '';
          const lastInitial = lastName?.charAt(0).toUpperCase() || '';
          this.userInitials = `${firstInitial}${lastInitial}`;
        } else if (email) {
          const [firstPart] = email.split('@');
          const firstInitial = firstPart.charAt(0).toUpperCase();
          this.userInitials = `${firstInitial}`;
        }
      } else {
        this.isLoggedIn = true; 
        this.userInitials = 'G';
      }
    });
  }

  /**
   * Toggles the menu state between open and closed.
   * 
   * @example
   * component.toggleMenu();
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Logs the user out by clearing the session storage and calling the global logout method of {@link AppComponent}.
   */
  logout() {
    sessionStorage.clear();
    this.appComponent.logout();
  }

  /**
   * Closes the menu if a click occurs outside the menu or dropdown elements.
   * 
   * @param event The click event on the document.
   */
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.menu-button') && !targetElement.closest('.dropdown_menu')) {
      this.menuOpen = false;
    }
  }
}
