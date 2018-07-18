import Firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyC0SyPk50U23db-yiDO-8mlBb_8WY7lCOg",
  authDomain: "processreviewer.firebaseapp.com",
  databaseURL: "https://processreviewer.firebaseio.com",
  projectId: "processreviewer",
  storageBucket: "",
  messagingSenderId: "760266619921"
};

export const firebase = Firebase.initializeApp(config);
export const database = firebase.database();
