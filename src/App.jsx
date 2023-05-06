import React from "react";
import {Routes, Route} from "react-router-dom";

import {Home} from "./pages/Home";
import {Register} from "./pages/Register/Register";
import {Login} from "./pages/Register/Login";

import "./App.css";
import {UserProfile} from "./pages/profile/UserProfile";


/**
 * Определяет маршруты на сайте
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;
