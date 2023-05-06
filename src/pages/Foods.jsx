import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useScrollDirection } from 'react-use-scroll-direction'
import { FoodManagement, FoodPlan, MultiSelectComponent } from '../components';
import useToken from '../hooks/useToken';
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import moment from 'moment-jalaali'
import { BiEdit, BiSave } from 'react-icons/bi';
import { TiTick } from 'react-icons/ti';

const Foods = () => {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const dispatch = useDispatch();
  const [accessToken] = useToken();
  const [foodMode, setFoodMode] = useState(true)

  return (
    <div
      className={`md:absolute md:inset-0 mx-1 md:flex md:flex-col md:justify-start md:gap-1 md:items-center max-w-full box-border bg-white dark:bg-secondary-dark-bg p-2 md:transition-2 pt-4 mt-[4.25rem] text-sm`}
    >
      <div className="flex justify-center items-center gap-2">
        <button onClick={()=>setFoodMode(true)} className={`rounded ${!foodMode?'bg-gray-400':'bg-blue-400'} px-2 py-1`}>تعیین برنامه غذایی</button>
        <button onClick={()=>setFoodMode(false)} className={`rounded ${foodMode?'bg-gray-400':'bg-blue-400'} px-2 py-1`}>مدیریت دسته و غذا</button>
      </div>
      {!foodMode?(
        <FoodManagement/>
      ):(
        <FoodPlan/>
      )}
    </div>
  );
};

export default Foods;
