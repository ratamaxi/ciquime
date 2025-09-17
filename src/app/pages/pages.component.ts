import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
    constructor(public router: Router) {}

}
