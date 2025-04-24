/**
 * @file Root component of the Angular application.
 */

import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { SharedComponent } from "./shared/shared.component";
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedComponent, RouterModule, LogInComponent, SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  /**
   * Firebase authentication instance
   */
  auth = inject(Auth);

  /**
   * Application title
   */
  title = 'join';

  /**
   * Firebase service instance
   */
  firebase = inject(FirebaseService);

  /**
   * Indicates if the user is logged in
   */
  isLoggedIn = false;

  /**
   * Indicates if a new user is signing up
   */
  newUser?: boolean;

  /**
   * Stores the user's name
   */
  usersName?: string;

  /**
   * Stores the current route
   */
  currentRoute: string = '';

  currentUser = this.auth.currentUser; 
  isLoading = true;

  /**
   * Constructor for AppComponent
   * @param router - Angular Router instance
   */
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      //onAuthStateChanged(this.auth, (user: any) => {
        onAuthStateChanged(this.auth, (user: User | null) => {
      if(user) {
        this.isLoggedIn = !!user;
        this.isLoading = false;

        if (this.isLoggedIn && this.router.url === '/') {
          this.router.navigate(['/summary']);
        }
      }
      
 
      });
    }
  }

  /**
   * Checks if the current page is either 'Imprint' or 'Privacy Policy'
   * @returns True if the page is Imprint or Privacy Policy, otherwise false
   */
  isPrivacyOrImprintPage(): boolean {
    return this.currentRoute === '/imprint' || this.currentRoute === '/privacy-policy';
  }

  /**
   * Handles login success by setting the user as logged in
   */
  onLoginSuccess() {
    this.isLoggedIn = true; 
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isLoggedIn', 'true'); // Persist the logged-in state
    }
  }

  /**
   * Navigates to the Sign-Up page
   */
  goToSignUp() {
    this.newUser = true;
  }
  
  /**
   * Logs out the user and redirects to the login page
   */
  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedIn = false;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('isLoggedIn'); // Clear the logged-in state
      }
      this.router.navigate(['/']);
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Resets the new user flag
   */
  resetNewUser() {
    this.newUser = false;
    this.isLoggedIn = false;
  }
}

