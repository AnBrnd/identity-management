import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LdapEditComponent} from "./ldap-edit/ldap-edit.component";
import {LdapListComponent} from "./ldap-list/ldap-list.component";
import {LdapAddComponent} from "./ldap-add/ldap-add.component";
import {AuthGuard} from "../security/AuthGuard";

const adminRoutes: Routes = [
  {
    path: 'user',
    canActivate: [AuthGuard],
    children: [
      {path: 'list', component: LdapListComponent},
      {path: 'add', component: LdapAddComponent},
      {path: ':id', component: LdapEditComponent},
      {path: '', redirectTo: 'user/list', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class LdapManagementRoutingModule {
}
