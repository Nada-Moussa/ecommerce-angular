import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {

  constructor(private _authService: AuthService, private _router: Router) { }

  shrink = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.shrink = window.scrollY > 40; // adjust threshold as needed
  }
  
  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  logout(): void {
    this._authService.logOut();
    this._router.navigate(['/signin']);
  }

}

