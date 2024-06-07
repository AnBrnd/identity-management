import { AbstractControl, ValidationErrors, ValidatorFn, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

// Validateur de correspondance des mots de passe
export const passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password: AbstractControl | null = control.get('password');
  const confirmPassword: AbstractControl | null = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value
    ? null
    : { passwordMatching: true };
};

// Classe pour gérer l'état des erreurs de validation
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.parent && control.parent.invalid && (control.touched || isSubmitted));
  }
}
