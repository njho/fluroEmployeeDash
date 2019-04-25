import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDla9YTbY-xWYHq2MTPx7ZD-8QWfWYReG8',
  authDomain: 'employeeportal-e9481.firebaseapp.com',
  databaseURL: 'https://employeeportal-e9481.firebaseio.com',
  projectId: 'employeeportal-e9481',
  storageBucket: 'employeeportal-e9481.appspot.com',
  messagingSenderId: '152099468828'
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.firestore = app.firestore();
    this.storage = app.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  sendPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  getCustomClaims = () => this.auth.currentUser.getIdTokenResult();

  getIdToken = () => this.auth.currentUser.getIdToken(true);

  /**
   * Merge Auth and DB User API
   * Determine if the user is authorized to be entering this dashboard.
   */
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.getCustomClaims()
          .then((/* idTokenResult */) => {
            // const { isPartOfCompany, role } = idTokenResult.claims;
            // // eslint-disable-next-line
            // authUser = {
            //   uid: authUser.uid,
            //   email: authUser.email,
            //   customClaims: idTokenResult.claims
            // };

            // if (
            //   (isPartOfCompany && role === 'admin') ||
            //   role === 'superAdmin'
            // ) {
            //   next(authUser);
            // } else {
            //   this.doSignOut();
            // }

            next(authUser);
          })
          .catch(error => {
            console.log(error);
          });

        // Get the user from the Database
        // this.user(authUser.uid)
        //   .get()
        //   .then(doc => {
        //     if (!doc.exists) {
        //       console.log('AuthUser roles doc does not exist');
        //     } else {
        //       const dbUser = doc.data();

        //       // default empty roles
        //       if (!dbUser.roles) {
        //         dbUser.roles = [];
        //       }

        //       // merge auth and db user
        //       // eslint-disable-next-line
        //       authUser = {
        //         uid: authUser.uid,
        //         email: authUser.email,
        //         ...dbUser
        //       };
        //     }

        //     next(authUser);
        //   });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.firestore.collection(`users`).doc(uid);

  users = () => this.firestore.collection('users');

  firestoreAccess = () => this.firestore;

  storageAccess = () => this.storage;
}

export default Firebase;
