import { useEffect, useRef, useState } from 'react'

const useKey = (key, cb) => {
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
    document.addEventListener('keyup', handle, { passive: false });
    return () => document.removeEventListener('keyup', handle, { passive: false })
  }, [key])
}

export default useKey