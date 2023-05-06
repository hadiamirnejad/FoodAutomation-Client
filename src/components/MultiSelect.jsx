import React, { useEffect, useRef, useState } from 'react';
import {useTranslation} from 'react-i18next'
import useKeyPress from '../hooks/useKeyPress';
import useOutsideClicked from '../hooks/useOutsideClick';

const MultiSelect = ({data, value=[],  onChange, onClick, id, tabIndex, showIndex=false, fontSize='text-xs', fill='currentColor', fields={title: 'title', value: 'value', hint: 'hint'}})=>{

const [showHintHandler,setShowHintHandler] = useState([...Array(data.length)].map(()=>false))
const codes = [9785,9786,9787,9829,9830,9827,9824,8226,9688,9475,9689,9794,9792,9834,9535,9788,9658,9668,8597,8252,182]
for(let i=0;i<data.length; i++){
  if(i<9){
    useKeyPress(i+48,(e)=>{
      if(document.activeElement.id === id){
        changeHandler(data[i])
      }
    })
  }
  useKeyPress(codes[i],(e)=>{
    if(document.activeElement.id === id){
      changeHandler(data[i])
    }
  })
}

const changeHandler = (d)=>{
  value.includes(d[fields.value])?onChange(value.filter(ele=>ele !== d[fields.value])):onChange([...value,d[fields.value]])
}
  return (
    <div id={id}  tabIndex={tabIndex} onClick={onClick} className={`flex flex-wrap items-center gap-2`}>
      {data.map((d, idx)=><div key={idx} onMouseEnter={()=>setShowHintHandler(showHintHandler.map((s,index)=>{if(index===idx){return true} else {return false}}))} onMouseLeave={()=>setShowHintHandler(showHintHandler.map((s,index)=>{if(index===idx){return false} else {return s}}))} onClick={()=>changeHandler(d)} className="relative cursor-pointer flex justify-start items-center gap-1 hover:text-gray-400">
      {value.includes(d[fields.value])?(
        <svg fill={fill} xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20">
          <path d="M5.48 8.089l1.583-1.464c1.854.896 3.028 1.578 5.11 3.063 3.916-4.442 6.503-6.696 11.312-9.688l.515 1.186c-3.965 3.46-6.87 7.314-11.051 14.814-2.579-3.038-4.301-4.974-7.469-7.911zm12.52 3.317v6.594h-16v-16h15.141c.846-.683 1.734-1.341 2.691-2h-19.832v20h20v-11.509c-.656.888-1.318 1.854-2 2.915z"/>
        </svg>
      ):(
        <svg fill={fill} xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20">
          <path d="M18.02 2V18h-16v-16h16C18 2 20 0 20 0h-20v20h20V0z"/>
        </svg>
      )}
        <p className={fontSize}>{showIndex && `(${idx}) `}{d[fields.title]}</p>
        <div className={`absolute -bottom- translate-x-1/2 start-1/2 translate-y-full z-50 w-fit text-gray-200 text-xs bg-gray-700 py-1 px-2 rounded-md whitespace-pre ${(!showHintHandler[idx] || d[fields.hint] === '') && 'hidden'}`}>{d[fields.hint]}</div>
      </div>
      )}
  </div>
  )
}

export default MultiSelect;
