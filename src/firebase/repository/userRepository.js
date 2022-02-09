import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, push, serverTimestamp } from "firebase/database";
import config from "../FirebaseConfig";

export default class UserRepository{
  constructor(){
    const firebaseConfig = config;
    
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.db = getDatabase();
  }

  ref(path = ""){
    return ref(this.db, `users${path}`);
  }
  
  getAllUsers (callback){    
    return onValue(this.ref(), (snapshot) => {
      const data = [];
      snapshot.forEach(function(childSnapshot) {
        data.push({id:childSnapshot.key,...childSnapshot.val()});
      });

      callback(data);
    });
  }

  getOneUser (id, callback){    
    return onValue(this.ref(`/${id}`), (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  createUser(modelData) {
    push(this.ref(), {timestamp: serverTimestamp(),...modelData});
  }

}