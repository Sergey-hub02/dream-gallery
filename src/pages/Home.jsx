import React from "react";
import {MyHeader} from "../components/Header/MyHeader";
import {MyFooter} from "../components/Footer/MyFooter";


/**
 * Главная страница сайта
 * @returns {JSX.Element}
 * @constructor
 */
export const Home = () => {
  return (
      <div className="Home">
        <MyHeader />

        <MyFooter />
      </div>
  );
}
