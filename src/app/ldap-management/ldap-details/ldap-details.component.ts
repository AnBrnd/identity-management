import {Router} from "@angular/router";
import  {Location} from "@angular/common";
import {UserLdap} from "../../models/user-ldap";
import {FormBuilder, Validators} from "@angular/forms";
import {ConfirmValidParentMatcher, passwordMatchingValidator} from "./passwords-validator.directive";

export abstract class LdapDetailsComponent {

  passwordPlaceHolder: string;
  user: UserLdap | undefined;
  processLoadRunning: boolean = false;
  processValidateRunning: boolean = false;
  errorMessage = '';

  userForm = this.fb.group({
    login: [''],
    nom: [''],
    prenom: [''],
    passwordGroup: this.fb.group({
      password: [''],
      confirmPassword: [''],
    }, {validators: passwordMatchingValidator}),
    mail: {value: '', disabled: true},
  });

  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  protected constructor(
    public addForm: boolean,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.passwordPlaceHolder = 'Mot de passe' + (this.addForm ? '' : '(vide si inchangé)');
    if (this.addForm) {
      this.passwordForm?.get('password')?.addValidators(Validators.required);
      this.passwordForm?.get('confirmPassword')?.setValidators(Validators.required);
    }
  }

  protected onInit(): void {

  }

  get passwordForm() {return this.userForm.get('passwordGroup') }



  goToLdap() {
    this.router.navigate(['/user/list']).then((e) =>  {
      if (!e) {
        console.error("Navigation has failed!");
      }
    });
  }

  onSubmitForm() {
    this.validateForm();
  }

  abstract validateForm(): void;


  updateLogin(): void {
    const control = this.userForm.get('login');
    if (control === null) {
      console.error("L'objet 'login' du formulaire n'existe pas");
      return;
    }
    control.setValue((this.formGetValue('prenom') + '.' +
      this.formGetValue('nom')).toLowerCase());
    this.updateMail();
  }

  updateMail(): void {
    const control = this.userForm.get('mail');
    if (control === null) {
      console.error("L'objet 'mail' du formulaire n'existe pas");
      return;
    }
    control.setValue((this.formGetValue('login').toLowerCase() + '@epsi.lan'))
  }

  isFormValid(): boolean {
    return this.userForm.valid && (!this.addForm || this.formGetValue('passwordGroup.password') !== '');
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
      employeNumero: 1,
      employeNiveau: 1,
      dateEmbauche: '2020-02-02',
      publisherId: 1,
      active: true,
      motDePasse: '',
      role: 'ROLE_USER'
    };
  }

  getErrorMessage(): string {
    if (this.passwordForm?.errors) {
      return 'Les mots de passe ne correspondent pas';
    }
    return 'Entrez un mot de passe';
  }
}



