import {UserLdap} from "./user-ldap.model";

export const LDAP_USERS: UserLdap[] = [
  {
    login: 'john.doe',
    nom:'Doe',
    prenom:'John',
    nomComplet:'Doe John',
    motDePasse:null,
    mail:'doe.john@epsi.fr',
    role:'ROLE_USER',
    employeNumero:1234,
    employeNiveau:120,
    dateEmbauche:'2020-01-01',
    publisherId:1,
    active:true,
  },

  {
    login: 'selina.kyle',
    nom:'Kyle',
    prenom:'Selina',
    nomComplet:'Kyle Selina',
    motDePasse:null,
    mail:'kyle.selina@epsi.fr',
    role:'ROLE_USER',
    employeNumero:2234,
    employeNiveau:220,
    dateEmbauche:'2020-02-02',
    publisherId:2,
    active:true,
  },
  ]
