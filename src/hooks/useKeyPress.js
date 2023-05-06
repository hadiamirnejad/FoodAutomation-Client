import { useEffect, useRef, useState } from 'react'

const useKeyPress = (key, cb) => {
  const callbackRef = useRef(cb)
  useEffect(()=>{
    callbackRef.current = cb;
  })
  useEffect(() => {
    const handle = (e) => {
      // console.log(e.keyCode)
      if (e.keyCode === 229) {
        return;
      }
      if(e.keyCode===112){
        e.preventDefault();
      }

      if(e.keyCode === key){
        callbackRef.current(e);
      }
    }
    document.addEventListener('keypress', handle);
    return () => document.removeEventListener('keypress', handle)
  }, [key])
}

export default useKeyPress