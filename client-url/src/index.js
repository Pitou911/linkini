import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyD5lMcpkaEc80Qa1Ropm3UwDawpSs-puxk",
//   authDomain: "url-shortener-dfedf.firebaseapp.com",
//   databaseURL:
//     "https://url-shortener-dfedf-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "url-shortener-dfedf",
//   storageBucket: "url-shortener-dfedf.appspot.com",
//   messagingSenderId: "420063017796",
//   appId: "1:420063017796:web:deb6aa758418c778933511",
// };

initializeApp(firebaseConfig);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
