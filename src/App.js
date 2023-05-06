import React, { useEffect } from "react";
import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import "./App.css";
import 'react-loading-skeleton/dist/skeleton.css'

import SiteRoutes from "./Routes";
import useToken from "./hooks/useToken";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { SkeletonTheme } from 'react-loading-skeleton'
import useUser from "./hooks/useUser";

const App = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => ({
    theme: state.item,
  }));

  const [accessToken] = useToken();

  useEffect(()=>{
    const load = async () => {
      let currentThemeColor = localStorage.getItem("colorMode");
      let currentThemeColorName = localStorage.getItem("colorName");
      let currentThemeMode = localStorage.getItem("themeMode");
      let currentLang = localStorage.getItem("lang");
      dispatch({
        type: "CHANGE_THEME",
        themeMode: currentThemeMode || "Light",
      });
      if (currentThemeColor) {
        dispatch({
          type: "CHANGE_COLOR",
          payload:{
            colorMode: currentThemeColor,
            colorName: currentThemeColorName,
          } 
        });
      }
      if (currentLang) {
        dispatch({
          type: "LANG",
          lang: currentLang,
        });
        i18n.changeLanguage(currentLang);
      }
    }
  load();
  }, []);

  useEffect(()=>{
    document.onkeydown = event=>{
      if(event.keyCode===112){
        event.preventDefault();
      }
    };
  },[])
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <div
      className={theme.themeMode === "Dark" ? "dark text-gray-100" : ""}
      dir={theme.direction}
    >
      <SiteRoutes />
    </div>
    </SkeletonTheme>
  );
};

export default App;
