import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useScrollDirection } from 'react-use-scroll-direction'
import { MultiSelectComponent } from '../components';
import useToken from '../hooks/useToken';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import moment from 'moment-jalaali'
import { BiSave } from 'react-icons/bi';

const Home = () => {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const dispatch = useDispatch();

  const [data, setData] = useState([])
  const [fromDate, setFromDate] = useState(moment().startOf('week').add(7,'days').format('YYYY-MM-DD'))
  const [toDate, setToDate] = useState(moment().endOf('week').add(7,'days').format('YYYY-MM-DD'))

  const [accessToken] = useToken();

  const selectFoodHandler = (date, foodId) => {
    setData(data.map(d=>{if(d.date===date){return {...d, orders: [{userId: user._id, food: foodId}]}}else{return d}}))
  }
  useEffect(() => {
    if(!fromDate || !toDate) return;
    loadData();
  }, [fromDate, toDate])
  // const [csrfTokenState, setCsrfTokenState] = useState('')
  // const getCall = async ()=>{
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getCSRFToken`,{
  //       headers:{
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       }
  //     })
  //     setCsrfTokenState(response.data.csrfToken)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   getCall();
  // }, [])
  const loadData = async()=>{
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getOrders`,{
        user: user._id, fromDate, toDate
      },{headers:{accessToken,
        Accept: "application/json",
        "Content-Type": "application/json",
        // "xsrf-token": csrfTokenState,
      },withCredentials: true,})

      if(response.data.error){
        return;
      }
      // console.log(response.data.map(d=>{return {...d, orders: d.orders.filter(dor=>dor.userId===user._id).length===0?[{userId: user._id, food: d.defaultFood}]:d.orders.filter(dor=>dor.userId===user._id)}}))
      setData(response.data.map(d=>{return {...d, orders: d.orders.filter(dor=>dor.userId===user._id).length===0?[{userId: user._id, food: d.defaultFood}]:d.orders.filter(dor=>dor.userId===user._id)}}))
    } catch (error) {
      console.log(error)
    }
  }
  const saveOrdersHandler = async()=>{
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/setOrder`,{
        newOrders: data, user: user._id
      },{headers:{accessToken}});
      if(response.data.error){
        return;
      }
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'عملیات موفق',
          description: 'اطلاعات با موفقیت ذخیره شد.',
          type: 'success'
        },
      });
    } catch (error) {
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'خطا',
          description: error,
          type: 'error'
        },
      });
    }
  }
  moment.loadPersian()
  return (
    <div
      className={`md:absolute md:inset-0 mx-1 md:flex md:justify-center md:items-start flex flex-col max-w-full box-border select-none bg-white dark:bg-gray-800 p-2 md:transition-2 pt-4 mt-[4.25rem] text-sm`}
    >
      <div className="w-full h-full overflow-hidden rounded-md shadow-md">
        <img src="/images/background.jpg" className='w-full' alt="" />
      </div>
      <div className="w-full flex justify-center items-center gap-4 select-none my-2">
        <button onClick={()=>{setFromDate(moment(fromDate).subtract(7, 'day').format('YYYY-MM-DD'));setToDate(moment(toDate).subtract(7, 'day').format('YYYY-MM-DD'))}} className='text-gray-700 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 text-2xl px-2'>{theme.direction==="rtl"?<MdOutlineNavigateNext/>:<MdOutlineNavigateBefore/>}</button>
        <button onClick={()=>{setFromDate(moment().startOf('week').format('YYYY-MM-DD'));setToDate(moment().endOf('week').format('YYYY-MM-DD'))}} className={`text-sm ${moment().startOf('week').format('YYYY-MM-DD') !== fromDate?'bg-teal-600 hover:bg-teal-500 text-white':'text-teal-600 dark:text-white font-bold'} rounded px-2`}>{moment().startOf('week').format('YYYY-MM-DD') !== fromDate?`${Math.abs(moment(fromDate).diff(moment().startOf('week'),'days') / 7)} هفته ${moment(fromDate).diff(moment().startOf('week'),'days') / 7<0?'قبل':'بعد'} (برو به هفته جاری)`:'هفته جاری'}</button>
        <button onClick={()=>{setFromDate(moment(fromDate).subtract(-7, 'day').format('YYYY-MM-DD'));setToDate(moment(toDate).subtract(-7, 'day').format('YYYY-MM-DD'))}} className='text-gray-700 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 text-2xl px-2'>{theme.direction==="rtl"?<MdOutlineNavigateBefore/>:<MdOutlineNavigateNext/>}</button>
      </div>
      <hr className='w-full my-2'/>
      <div className="w-full h-full grid grd-cols-1 md:grid-cols-7 gap-2 text-lg">
        {data.map((d,idx)=><div key={idx} className={`${moment(d.date).diff(moment().endOf('week').format('YYYY-MM-DD'), 'days') <= 0 && 'pointer-events-none'} ${d.type===2?'bg-red-400 text-white text-xl font-bold':'bg-gray-100 dark:bg-gray-700'} w-full rounded-md border p-2 flex flex-col gap-1`}>
          <p className='text-center'>{['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'][idx]}</p>
          <p className='text-center text-sm'>{moment(d.date).format('jDD jMMMM jYYYY')}</p>
          <hr/>
          {d.type === 1 && <div className="flex flex-col justify-between items-center gap-1 w-full h-full">
            <div className="flex flex-col justify-between items-center gap-1 w-full">
              {d.foods.map((food, foodIdx)=><div key={foodIdx} onClick={()=>selectFoodHandler(d.date, food._id)} className={`w-full flex justify-start items-center gap-1 border rounded px-2 py-1 cursor-pointer text-[0.9rem] bg-gray-200 dark:bg-gray-600 hover:bg-teal-200 dark:hover:bg-teal-400 ${d.orders.filter(o=>o.userId===user._id && o.food===food._id).length > 0 && 'bg-teal-300 dark:bg-teal-500'}`}>
                {d.orders.filter(o=>o.userId===user._id && o.food===food._id).length > 0 ? <FiCheckSquare/> : <FiSquare/>}{food.title}
              </div>)}
            </div>
            {d.foods.length > 0 && <div onClick={()=>selectFoodHandler(d.date, null)} className={`w-full flex justify-start items-center gap-1 border rounded px-2 py-1 cursor-pointer text-[0.9rem] bg-gray-200 dark:bg-gray-600 hover:bg-teal-200 dark:hover:bg-teal-400 ${d.orders.filter(o=>o.userId===user._id && o.food===null).length > 0 && 'bg-red-300 dark:bg-red-400'}`}>
            {d.orders.filter(o=>o.userId===user._id && o.food===null).length > 0 ? <FiCheckSquare/> : <FiSquare/>}حضور ندارم
            </div>}
          </div>}
          {d.type === 2 && <p className='h-full flex justify-center items-center'>تعطیل</p>}
        </div>)}
        <div className="col-span-1 md:col-span-7 flex justify-center items-center gap-4">
        {moment(fromDate).diff(moment().endOf('week').format('YYYY-MM-DD'), 'days') > 0 && <button onClick={()=>{saveOrdersHandler()}} className='bg-blue-400 text-white hover:bg-blue-300 rounded-md flex justify-center items-center gap-1 py-1 px-2 w-full md:w-1/3 text-2xl'><BiSave/><p className='text-lg'>ذخیره</p></button>}
        </div>
      </div>
    </div>
  );
};

export default Home;
