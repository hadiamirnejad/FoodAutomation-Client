import React, { useEffect, useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { HiHome, HiOutlineHome } from 'react-icons/hi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line, RiTodoLine } from 'react-icons/ri';
import { MdDarkMode, MdFormatTextdirectionLToR, MdFormatTextdirectionRToL, MdKeyboardArrowDown, MdLightMode } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import avatar from '../data/avatar.jpg';
import { Notification, UserProfile } from './';
import { useScroll } from '../hooks/useScroll';
import io from 'socket.io-client';
import axios from 'axios';
import useToken from '../hooks/useToken';

const socket = io.connect(`${process.env.REACT_APP_SOCKET_APP_BASE_URL}`);

const NavButton = ({ title, customFunc, icon, color, dotColor, className }) => (
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
);

const Navbar = () => {
  const { t } = useTranslation();
  const [accessToken, setToken] = useToken()

  const dispatch = useDispatch();
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const [conflictCount, setConflictCount] = useState(0)

  useEffect(() => {
    socket.on("conflict_and_cheching_response", (data) => {
      setConflictCount(data[0]+data[1])
    });
  }, [socket]);

  useEffect(()=>{
    const interval = setInterval(() => {
      socket.emit('conflict_and_cheching', user?._id)
    }, 1000);

    return () => {
      clearInterval(interval)
    }
  },[user])

  const navigate = useNavigate();

  const handleItemClick = async(clicked) => {
    let s = !theme[clicked];
    dispatch({
      type: "SHOW_ITEM",
      payload: {value: clicked, show: s},
    });

    if(clicked==='notification' && theme.pinChat){
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/updateMessengerState`,{
          id: user._id,
          messenger: s,
        },{
          headers: {
            accessToken
          }
        })
  
        if(response.data.error){
          return 
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  const [time, setTime] = useState()
  useEffect(() => {
    const d= new Date();
    setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const d= new Date();
      setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`)
    }, 1000);
  }, [time])

  const toggleTheme = () => {
    let t;
    if (theme.themeMode == "Dark") t = "Light";
    else t = "Dark";
    dispatch({
      type: "CHANGE_THEME",
      themeMode: t,
    });
  };
  
  const toggleDirection = () => {
    let d;
    if (theme.direction == "ltr") d = "rtl";
    else d = "ltr";
    dispatch({
      type: "CHANGE_DIRECTION",
      dir: d,
    });
  };

  return (
    <div>
      <div
        className={`fixed top-0 max-w-full box-border bg-white dark:bg-secondary-dark-bg z-50 p-2 start-0 w-full
        md:start-0 md:w-[calc(100%-0.5rem)] md:ms-1 duration-300 border-box flex justify-between items-center`}
      >
        <p className={`w-24 text-sm font-bold text-gray-400 tracking-widest ${theme.direction==='rtl'?'text-end':'text-start'}`}>{time}</p>
        <NavButton
          title={t("theme")}
          customFunc={() => toggleTheme()}
          color={theme.colorMode}
          icon={theme.themeMode == "Dark" ?<MdLightMode/>:<MdDarkMode/>}
          className={`text-md`}
        />
        <NavButton
          title={t("direction")}
          customFunc={() => toggleDirection()}
          color={theme.colorMode}
          icon={theme.direction == "ltr" ?<MdFormatTextdirectionRToL/>:<MdFormatTextdirectionLToR/>}
          className={`text-md`}
        />
        {user ? (
            <div className="flex justify-end w-full">
              <div
                className="relative flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                onClick={() => handleItemClick("userProfile")}
              >
                {conflictCount>0 && ['admin','checker'].includes(user.role) && <span
                  className="absolute inline-flex bg-red-400 animate-pulse rounded-full h-5 w-5 start-0 top-0 text-xs font-bold text-white justify-center items-center"
                >{conflictCount}</span>}
                <img
                  className="rounded-full w-8 h-8"
                  src={user && `${user.avatar}`}
                  alt="user-profile"
                />
                <p>
                  <span className="text-gray-400 font-bold ml-1 text-xs">
                    {user && user.name}
                  </span>
                </p>
                <MdKeyboardArrowDown className="text-gray-400 text-14" />
              </div>
              <NavButton
                title={t("user_home")}
                customFunc={() => navigate(`/`)}
                color={theme.colorMode}
                icon={<HiOutlineHome />}
                className={`text-md`}
              />
            </div>
        ) : (
          <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
            <NavButton
              title={t("signin")}
              customFunc={() => navigate("/signin")}
              color={theme.colorMode}
              icon={<AiOutlineLogin />}
              className={`text-md`}
            />
            <NavButton
                title={t("home")}
                customFunc={() => navigate("/")}
                color={theme.colorMode}
                icon={<HiHome />}
                className={`text-md`}
              />
          </div>
        )}
      </div>
      {user && (
        <>
          {theme.userProfile && <UserProfile />}
        </>
      )}
    </div>
  );
};

export default Navbar;
