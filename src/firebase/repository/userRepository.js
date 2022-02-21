import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, child, onValue, get, set, push, serverTimestamp } from "firebase/database";
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
  
  init(){
    console.log(serverTimestamp());
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
    push(this.ref(), modelData);
  }

  updateUser(path, modelData){
    // this.ref(`/${path}`).once("value").then(snapshot => {
    //   const data = snapshot.val();
    //   const newData = {...data,...modelData};
    //   set(this.ref(`/${path}`), newData);
    //   callback(newData);
    // })
    // onValue(this.ref(`/${path}`), (snapshot) => {
    //   const data = snapshot.val();
    //   const newData = {...data,...modelData};
    //   set(this.ref(`/${path}`), newData);
    //   callback(newData);
    // });
    return new Promise((resolve, reject) => {

      get(child(this.ref(), `/${path}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const newData = {...data,...modelData};
          set(this.ref(`/${path}`), newData);
          resolve(newData);
        } else {
          reject("No data available");
        }  
      }).catch((error) => {
        console.error(error);
    });
  })
}

}
