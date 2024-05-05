// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC45PQ5h6TIbgTijYEiyqzXem9M9MT1s8k",
	authDomain: "hospital-crm-sys.firebaseapp.com",
	projectId: "hospital-crm-sys",
	storageBucket: "hospital-crm-sys.appspot.com",
	messagingSenderId: "377618583227",
	appId: "1:377618583227:web:fe6c0b53987fc7d2e1a39e",
	measurementId: "G-3TC81JK5LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
