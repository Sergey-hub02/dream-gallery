import React from "react";
import {Routes, Route} from "react-router-dom";

import {Home} from "./pages/Home";
import {Register} from "./pages/Register/Register";
import {Login} from "./pages/Register/Login";
import {UserProfile} from "./pages/profile/UserProfile";
import {PhotoUpload} from "./pages/PhotoUpload/PhotoUpload";
import {PhotoDetails} from "./pages/PhotoDetails/PhotoDetails";
import {PhotoEdit} from "./pages/PhotoEdit/PhotoEdit";
import {AlbumAdd} from "./pages/AlbumAdd/AlbumAdd";

import "./App.css";
import {AlbumEdit} from "./pages/AlbumEdit/AlbumEdit";


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

        <Route path="/photos/upload" element={<PhotoUpload />} />
        <Route path="/photos/:photoId" element={<PhotoDetails />} />
        <Route path="/photos/edit/:photoId" element={<PhotoEdit />} />

        <Route path="/albums/add" element={<AlbumAdd />} />
        <Route path="/albums/edit/:albumId" element={<AlbumEdit />} />
      </Routes>
    </div>
  );
}

export default App;
