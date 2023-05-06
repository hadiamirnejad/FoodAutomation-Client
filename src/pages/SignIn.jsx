import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import useKey from '../hooks/useKey';
import useToken from '../hooks/useToken';
import useUser from '../hooks/useUser';
import store from '../redux/store';
axios.defaults.withCredentials = true

function SignIn() {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user,
  }));
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      return navigate('/');
    }
  },[])
  
  const [errorMessage, setErrorMessage] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const dispatch = useDispatch();
  
  const [, setToken] = useToken();
  const { t } = useTranslation();
  const [csrfTokenState, setCsrfTokenState] = useState('')
  const getCall = async ()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}`,{
        headers:{
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
      setCsrfTokenState(response.data.csrfToken)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCall();
  }, [])
  
  const onLogInClicked = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/signin`,
        {
          username: usernameValue,
          password: passwordValue,
        },{
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "xsrf-token": csrfTokenState,
          },
          withCredentials: true,
      }
      );

      if(response.data.error){
        throw response.data.error
      }
      const { accessToken, user: userD } = response.data;
      setToken(accessToken);
      setParams(userD)
      navigate('/')
    } catch (err) {
      console.log(err)
      if(err.message){
        setErrorMessage(t('can_not_connect_to_server'));
      }
      else{
        setErrorMessage(t(err));
      }
    }
  }
  const setParams = (userD)=>
  {
    new Promise(function(resolve, reject) {
      dispatch({
        type: "LOG_IN",
        user: userD,
      });
      dispatch({
        type: "CHANGE_THEME",
        themeMode: userD.theme,
      });
      dispatch({
        type: "CHANGE_DIRECTION",
        dir: userD.direction,
      });
      if(userD.messenger){
        dispatch({
          type: "SHOW_ITEM",
          payload: {value: 'notification', show: true},
        });
        dispatch({
          type: "CHAT_SIDE",
          pinChat: true,
        });
      }
      else{
        dispatch({
          type: "CHAT_SIDE",
          pinChat: false,
        });
      }
    }).then(()=>
    navigate(`/`)
  )
  };
  useKey(13,(e)=>{
    onLogInClicked();
  })
  return (
    <>
    <div className='absolute inset-0 z-20 flex justify-center items-center p-2'>
      <div
        className="p-2 md:p-5 rounded text-center w-96 bg-white dark:bg-gray-600 md:bg-transparent md:dark:bg-transparent font-bold dark:text-white"
      >
        <hr className="border-2 rounded border-white" />
        <div className="grid grid-cols-3 gap-2 items-center my-2">
          <label htmlFor="usernameInput" className='col-span-1 text-sm text-start'>{t("username")}</label>
          <input
            id="usernameInput"
            dir='ltr'
            className="col-span-2 bg-transparent border rounded text-sm px-2 py-1"
            aria-describedby="usernameHelp"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
            type="text"
            placeholder={t("username")}
          />
          <label htmlFor="passwordInput" className='col-span-1 text-sm text-start'>
            {t("password")}
          </label>
          <input
            id="passwordInput"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            type="password"
            dir='ltr'
            className="col-span-2 bg-transparent border rounded text-sm px-2 py-1"
            placeholder={t("password")}
          />
        </div>
        <hr className="border-2 rounded border-white" />
        <button className='rounded bg-blue-400 hover:bg-blue-300 px-3 py-1 text-sm text-white w-full my-2' onClick={onLogInClicked}>{t("signin")}</button>
        {errorMessage && <div className="text-red-500 text-lg border-1 border-red-500 p-2 mt-4">{errorMessage}</div>}
      </div>
    </div>
      <img src="/images/3.jpg" alt=""  className='absolute inset-0 z-10 h-full w-max md:h-fit md:w-full opacity-60'/>
    </>
  )
}

export default SignIn