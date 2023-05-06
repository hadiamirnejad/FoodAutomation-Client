import React, { useEffect, useInsertionEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {BsPin, BsFillPinFill} from 'react-icons/bs'

function Toast({positionX="end-0", positionY="top-2", duration=3}) {
  const { toastList } = useSelector((state) => ({
    toastList: state.toast,
  }));
  
  const dispatch = useDispatch();
  const removeHandler = (id)=>{
    dispatch({
      type: "REMOVE_TOAST",
      id: id,
    });
  }
  return (
    <div className={`fixed ${positionX} ${positionY} w-72 z-50 flex flex-col gap-2`}>
      {toastList.map((toast, idx)=>(
        <ToastElement key={idx} removeHandler={removeHandler} toastList={toastList} toast={toast} second={duration}/>
      ))}
    </div>
  )
}

function ToastElement({removeHandler, toast, second, toastList}) {
  const { theme } = useSelector((state) => ({
    theme: state.item,
  }));
  const [timer, setTimer] = useState(second*1000)
  const [pause, setPause] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState()

  useEffect(()=>{
    switch (toast.type) {
      case 'success':
        setBackgroundColor(`${theme.themeMode==='Dark'?'bg-green-500':'bg-green-200'}`)
        break;
      case 'error':
        setBackgroundColor(`${theme.themeMode==='Dark'?'bg-red-500':'bg-red-200'}`)
        break;
      case 'warning':
        setBackgroundColor(`${theme.themeMode==='Dark'?'bg-amber-500':'bg-amber-200'}`)
        break;
      case 'info':
        setBackgroundColor(`${theme.themeMode==='Dark'?'bg-blue-500':'bg-blue-200'}`)
        break;
    
      default:
        setBackgroundColor(`${theme.themeMode==='Dark'?'bg-green-500':'bg-green-200'}`)
        break;
    }
  },[theme])

  const interval = useRef(null);
  const updateTimer = () => {
    if(interval.current) return;
    interval.current = setInterval(() => {
      setTimer(pre=>pre-100);
    }, 100)
  }
  
  useEffect(() => {
    updateTimer();
    return () => {
      clearInterval(interval.current);
      interval.current=null;
    };
  }, [])
  
  useEffect(() => {
    if(timer <= 0) {
      clearInterval(interval.current);
      interval.current=null;
      removeHandler(toast.id);
    };
  }, [timer])
  
  return (
    <div className={`${backgroundColor} w-full rounded-s-md p-3 transition-all duration-700  dark:text-gray-200`}>
    <div className={`text-sm`}>
      <div className="flex justify-between items-center">
        <button className='cursor-pointer hover:text-gray-600 text-sm font-bold' onClick={()=>removeHandler(toast.id)}>X</button>
        <p>{timer/1000}</p>
        {!pause?<BsPin className='cursor-pointer hover:text-gray-600' onClick={()=>{clearInterval(interval.current);interval.current=null;setPause(true)}}/>:<BsFillPinFill className='cursor-pointer hover:text-gray-600' onClick={()=>{updateTimer();setPause(false)}}/>}
      </div>
      
      <hr className={`flex justify-between items-center my-1 ${backgroundColor}`}/>
      <p className='font-bold text-xs my-1'>{toast.title}</p>
      <p className='text-xs'>{toast.description}</p>

      {/* <p>{toast.id}</p> */}
    </div>
  </div>
  )
}

export default Toast