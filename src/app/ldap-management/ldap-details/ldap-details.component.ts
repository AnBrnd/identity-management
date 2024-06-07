import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLdap } from '../../models/user-ldap.model';
import { UsersService } from '../../service/users.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmValidParentMatcher, passwordMatchingValidator } from './passwords-validator.directive';

export abstract class LdapDetailsComponent {
  user: UserLdap | undefined;
  processLoadRunning = false;
  processValidateRunning = false;
  userForm: FormGroup;
  passwordPlaceHolder: string;
  errorMessage = '';
  confirmValidParentMatcher = new ConfirmValidParentMatcher();


  protected constructor(
    public addForm: boolean,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      login: [''],
      nom: [''],
      prenom: [''],
      passwordGroup: this.fb.group({
        password: [''],
        confirmPassword: ['']
      }, { validators: passwordMatchingValidator }),
      mail: [{ value: '', disabled: true }]
    });

    this.passwordPlaceHolder = 'Mot de passe' + (this.addForm ? '' : ' (vide si inchangé)');
    if (this.addForm) {
      this.passwordForm?.get('password')?.addValidators(Validators.required);
      this.passwordForm?.get('confirmPassword')?.addValidators(Validators.required);
    }
  }

  get passwordForm() {
    return this.userForm.get('passwordGroup') as FormGroup;
  }

  protected onInit(): void {
    // Cette méthode est vide, assurez-vous d'y ajouter des fonctionnalités si nécessaire.
  }


  goToLdap() {
    this.router.navigate(['/users/list']).then((e) => {
      if (!e) {
        console.error('Navigation has failed!');
      }
    });
  }

  onSubmitForm() {
    this.validateForm();
  }

  isFormValid(): boolean {
    return this.userForm.valid && (!this.addForm || this.formGetValue('passwordGroup.password') !== '');
  }

  abstract validateForm(): void;

  updateLogin() {
    const control = this.userForm.get('login');
    if (control === null) {
      console.error("L'objet 'login' du formulaire n'existe pas");
      return;
    }
    control.setValue((this.formGetValue('prenom') + '.' + this.formGetValue('nom')).toLowerCase());
    this.updateMail();
  }

  updateMail() {
    const control = this.userForm.get('mail');
    if (control === null) {
      console.error("L'objet 'mail' du formulaire n'existe pas");
      return;
    }
    control.setValue(this.formGetValue('login').toLowerCase() + '@epsi.lan');
  }

  getErrorMessage(): string {
    if (this.passwordForm?.errors) {
      return 'Les mots de passe ne correspondent pas';
    }
    return 'Entrez un mot de passe';
  }

  private formGetValue(name: string): string {
    const control = this.userForm.get(name);
    if (control === null) {
      console.error("L'objet '" + name + "' du formulaire n'existe pas");
      return "";
    }
    return control.value;
  }

  private formSetValue(name: string, value: string | number): void {
    const control = this.userForm.get(name);
    if (control === null) {
      console.error("L'objet '" + name + "' du formulaire n'existe pas");
      return;
    }
    control.setValue(value);
  }

  protected copyUserToFormControl(): void {
    if (this.user === undefined) {
      return;
    }
    this.formSetValue('login', this.user.login);
    this.formSetValue('nom', this.user.nom);
    this.formSetValue('prenom', this.user.prenom);
    this.formSetValue('mail', this.user.mail);
  }

  protected getUserFromFormControl(): UserLdap {
    return {
      id: this.user===undefined ? undefined : this.user.id,
      login: this.formGetValue('login'),
      nom: this.formGetValue('nom'),
      prenom: this.formGetValue('prenom'),
      nomComplet: this.formGetValue('nom') + ' ' + this.formGetValue('prenom'),
      mail: this.formGetValue('mail'),
      // Les valeurs suivantes devraient être reprises du formulaire
      employeNumero: 1, // this.formGetValue('employeNumero'),
      employeNiveau: 1, // this.formGetValue('employeNiveau'),
      dateEmbauche: '2020-04-24', // this.formGetValue('dateEmbauche'),
      publisherId: 1, // this.formGetValue('publisherId'),
      active: true, // this.formGetValue('active'),
      motDePasse: '',
      role: 'ROLE_USER'
    };
  }
}



