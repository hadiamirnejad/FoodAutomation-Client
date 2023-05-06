import React, { useEffect, useRef, useState } from 'react';
import {useTranslation} from 'react-i18next'
import useOutsideClicked from '../hooks/useOutsideClick';

const MultiSelectComponent = ({data, value=[], fff, onChange, className=' ', placeholder='فیلتر ...', fontSize='text-xs', autoHideItemBox=true, fill='currentColor', fields={title: 'title', value: 'value'}, itemsCount=10})=>{
  const [filterValue, setFilterValue] = useState('')
  const [showItemBox, setShowItemBox] = useState(false)
  const filterInput = useRef();
  useOutsideClicked(filterInput,()=>setShowItemBox(false))
  const changeHandler = (d)=>{
    value.includes(d[fields.value])?onChange(value.filter(ele=>ele !== d[fields.value])):onChange([...value,d[fields.value]]);
    setShowItemBox(false);
  }

  return (
    <div ref={filterInput} className={`${autoHideItemBox && 'relative'} w-full ${className}`}>
      <div className="flex flex-wrap flex-grow justify-start w-full items-center gap-1">
        {value.map((v,idx)=><p key={idx} onClick={()=>onChange(value.filter(ele=>ele !== v))} className={`${fontSize} border rounded whitespace-pre py-1 px-2 bg-gray-300 cursor-pointer dark:text-gray-700`}>X {data.filter(d=>d[fields.value]===v)[0][fields.title]}</p>)}
        <input style={{minWidth:'2rem'}} className={`rounded py-1 px-2 flex-grow bg-transparent ${fontSize?fontSize:'text-xs'}`} type="text" onFocusCapture={()=>setShowItemBox(true)} placeholder={placeholder} value={filterValue} onChange={(e)=>setFilterValue(e.target.value)}/>
      </div>
      <div className={`${autoHideItemBox && 'absolute z-50 top-full bg-white dark:bg-secondary-dark-bg'} ${autoHideItemBox && !showItemBox && 'hidden'} flex flex-wrap items-center gap-1 border p-2 rounded-sm`}>
      {data.filter(d=>d[fields.title].indexOf(filterValue) > -1 && !value.includes(d[fields.value])).filter((_,idx)=>idx < itemsCount).map((d, idx)=><div key={idx} onClick={()=>changeHandler(d)} className="cursor-pointer flex justify-start items-center gap-1 hover:text-gray-400">

        <p className={`${fontSize} border rounded py-1 px-2 ${value.includes(d[fields.value]) && 'bg-gray-300'}`}>{d[fields.title]}</p>
        </div>
      )}
      {data.filter(d=>d[fields.title].indexOf(filterValue) > -1 && !value.includes(d[fields.value])).length > itemsCount && <p className='text-xs my-2 text-red-400 dark:text-red-300'>...</p>}
      {data.filter(d=>d[fields.title].indexOf(filterValue) > -1 && !value.includes(d[fields.value])).length === 0 && <p className='text-xs my-2 text-red-400 dark:text-red-300'>آیتمی وجود ندارد...</p>}
      </div>
  </div>
  )
}

export default MultiSelectComponent;
