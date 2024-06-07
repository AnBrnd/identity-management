import { Component, OnInit } from '@angular/core';
import { LdapDetailsComponent } from '../ldap-details/ldap-details.component';
import { UsersService } from '../../service/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserLdap } from '../../models/user-ldap.model';
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-ldap-edit',
  templateUrl: '../ldap-details/ldap-details.component.html',
  styleUrls: ['../ldap-details/ldap-details.component.css']
})
export class LdapEditComponent extends LdapDetailsComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    fb: FormBuilder,
    router: Router,
    private snackBar: MatSnackBar
  ) {
    super(false, fb, router);
  }

  ngOnInit(): void {
    super.onInit();
    this.getUser();
  }

  validateForm(): void {
    console.log('LdapEditComponent - validateForm');
    this.processValidateRunning = true;
    this.usersService.updateUser(this.getUserFromFormControl()).subscribe({
      next: (value: UserLdap) => {
        this.processValidateRunning = false;
        this.errorMessage = '';
        this.snackBar.open('Utilisateur modifié !', 'X');
      },
      error: (err) => {
        this.processValidateRunning = false;
        this.errorMessage = 'Une erreur est survenue dans la modification !';
        console.error('Modification utilisateur', err);
        this.snackBar.open('Erreur dans la modification de l\'utilisateur', 'X');
      }
    });
  }

  private getUser(): void {
    const login: string | null = this.route.snapshot.paramMap.get('id');

    if (login === null) {
      console.error("Can't retrieve user id from URL");
      return;
    }

    this.usersService.getUser(login).subscribe({
      next: (user: UserLdap | undefined) => {
        if (user) {
          this.user = user;
          this.copyUserToFormControl();
          console.log('LdapDetails getUser =', user);
        } else {
          this.errorMessage = "L'utilisateur n'existe pas !";
          this.snackBar.open('Utilisateur non trouvé !', 'X');
        }
      },
      error: (err) => {
        this.errorMessage = "L'utilisateur n'existe pas !";
        console.error('Obtention utilisateur', err);
        this.snackBar.open('Utilisateur non trouvé !', 'X');
      }
    });
  }
}

