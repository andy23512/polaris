import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { KeyboardLayoutComponent } from '../components/keyboard-layout/keyboard-layout.component';

@Component({
  imports: [MatToolbar, MatIconButton, MatIcon, KeyboardLayoutComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    class: 'flex flex-col h-full',
  },
})
export class App {}
