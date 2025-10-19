import {Component, HostBinding, OnDestroy} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject, take, takeUntil} from 'rxjs';
import Swal from "sweetalert2";
import {LoginDataRequest} from "../../interfaces/auth.interface";
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  public items = Array(10).fill(0);
  private _themeColor: string = '';
  private destroy$: Subject<void> = new Subject();
  public recuperarPass: boolean = false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    sessionStorage.removeItem('token');
  }

  @HostBinding('style.--themeColor')
  private set themeColor(value: string) {
    if (value) this._themeColor = value;
  }

  public get themeColor(): string {
    return this._themeColor;
  }

  public loginForm = this.fb.group({
    nombre: [localStorage.getItem('nombre'), [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required]],
    email: [''],
    role: ['']
  });

  public recordarUsuario(remember: boolean): void {
    if (remember) {
      localStorage.setItem('nombre', this.loginForm.value.nombre || '');
    } else {
      localStorage.removeItem('nombre');
    }
  }

  public login(): void {
    localStorage.clear();
    sessionStorage.removeItem("token");
    this.limpiarEspaciosForm();
    const {nombre, password} = this.loginForm.getRawValue();
    const loginDataRequest: LoginDataRequest = {
      user: nombre,
      password: password,
    };
    this.loginService.login(loginDataRequest).pipe(take(1)).subscribe({
      next: () => {
       this.router.navigate(['/panel/home']).then();
      },
      error: (err) => {
         Swal.fire({
          position: 'center',
          icon: 'error',
          title: '¡Ups!',
          text: 'Usuario o Pass incorrectos',
          showConfirmButton: false,
          timer: 2500
        });
      },
      complete: () => {
      }
    });
  }

  private limpiarEspaciosForm(): void {
    const nombre = this.loginForm.value.nombre!.trim();
    const password = this.loginForm.value.password!.trim();
    this.loginForm.patchValue({
      nombre,
      password
    })
  }

  private get roleControl(): AbstractControl {
    return this.loginForm.controls['role'];
  }

  public get isValid(): boolean {
    return this.loginForm.valid;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
