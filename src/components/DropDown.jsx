import React, { useRef, useState } from 'react';
import {useTranslation} from 'react-i18next'
import useOutsideClicked from '../hooks/useOutsideClick';

const DropDown = ({data, placeHolder, onChange, value=null, className='', paddingY='', fields={title: 'title', value: 'value'}, beginFrom='start'})=>{
  const [showRoleDropDown, setShowRoleDropDown] = useState(false)
  const [filterText, setFilterText] = useState('')
  const dropDownRef = useRef(null)
  const ff = () => {
    setShowRoleDropDown(false)
  }

  useOutsideClicked(dropDownRef,ff)
  return (
    <div ref={dropDownRef} className={`relative inline-block text-left text-xs ${className}`}>
      <div className={`${className}`}>
        <button onClick={()=>setShowRoleDropDown(!showRoleDropDown)} type="button" className={`inline-flex w-full justify-between rounded border gap-3 ps-2 font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 whitespace-wrap text-start py-1 ${paddingY}`} id="menu-button">
          {(value === null || value.length === 0 || data.filter(d=>d[fields.value]===value).length === 0)?placeHolder:data.filter(d=>d[fields.value]===value)[0][fields.title]}
          <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div hidden={!showRoleDropDown} style={{zIndex:1000}} className={`absolute ${beginFrom}-0 z-50 mt-1 w-56 origin-top-right max-h-96 overflow-y-auto rounded-md bg-white dark:bg-gray-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
        <div className="pb-1 cursor-pointer text-start w-full" role="none">
          <div className="sticky top-0 start-0 py-1 w-full">
            <input className=' w-[calc(100%-0.5rem)] border rounded-md bg-transparent mx-1 px-2 py-1' placeholder='جستجو' type="text" value={filterText} onChange={(e)=>setFilterText(e.target.value)}/>
          </div>
          {data.filter(d=>d[fields.title].indexOf(filterText)>-1).map((d, idx)=>
            <a key={idx} onClick={()=>{onChange(d[fields.value]);setShowRoleDropDown(false)}} className="text-gray-700 hover:bg-gray-300 block px-2 py-1" role="menuitem" tabIndex="-1" id="menu-item-0">{d[fields.title]}</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default DropDown;
