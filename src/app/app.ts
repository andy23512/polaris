import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { KeyboardLayoutComponent } from '../components/keyboard-layout/keyboard-layout.component';

@Component({
  imports: [MatToolbar, KeyboardLayoutComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    class: 'flex flex-col h-full',
  },
})
export class App {}
