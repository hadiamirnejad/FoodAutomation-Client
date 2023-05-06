import React, { useRef, useState } from 'react';
import {useTranslation} from 'react-i18next'
import useOutsideClicked from '../hooks/useOutsideClick';

const RadioButton = ({data, value, onChange, onClick, id, tabIndex, fontSize='text-xs', fill='currentColor', fields={title: 'title', value: 'value'}})=>{
  // const [selectedValue, setSelectedValue] = useState()

  return (
    <div id={id} tabIndex={tabIndex} onClick={onClick} className="flex flex-wrap items-center gap-1">
      {data.map((d, idx)=><div key={idx} onClick={()=>{value===d[fields.value]?onChange(null):onChange(d[fields.value])}} className="cursor-pointer flex justify-start items-center gap-1 hover:text-gray-400">
      {value===d[fields.value]?(
        <svg fill={fill} xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20">
          <path d="M5.48 8.089l1.583-1.464c1.854.896 3.028 1.578 5.11 3.063 3.916-4.442 6.503-6.696 11.312-9.688l.515 1.186c-3.965 3.46-6.87 7.314-11.051 14.814-2.579-3.038-4.301-4.974-7.469-7.911zm12.52 3.317v6.594h-16v-16h15.141c.846-.683 1.734-1.341 2.691-2h-19.832v20h20v-11.509c-.656.888-1.318 1.854-2 2.915z"/>
        </svg>
      ):(
        <svg  fill={fill} xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20">
          <path d="M18.02 2V18h-16v-16h16C18 2 20 0 20 0h-20v20h20V0z"/>
        </svg>
      )}
        <p className={fontSize}>{d[fields.title]}</p>
      </div>
      )}
  </div>
  )
}

export default RadioButton;
