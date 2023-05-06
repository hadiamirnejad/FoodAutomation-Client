import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment-jalaali'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import useToken from '../../hooks/useToken';
import { BiSave } from 'react-icons/bi';
import { RiFileExcel2Fill } from 'react-icons/ri';
import {MultiSelectComponent, DropDown} from '../';
import useOutsideClicked from '../../hooks/useOutsideClick';
import * as XLSX from 'xlsx'

function FoodPlan() {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(moment().startOf('week').add(7,'days').format('YYYY-MM-DD'))
  const [toDate, setToDate] = useState(moment().endOf('week').add(7,'days').format('YYYY-MM-DD'))
  const [data, setData] = useState([])
  const [stat, setStat] = useState([])
  const [foods, setFoods] = useState([])
  const [units, setUnits] = useState([])
  const [orderStatForPrint, setOrderStatForPrint] = useState([])
  const [currentDateId, setCurrentDateId] = useState(null)
  const statRef = useRef(null);
  useOutsideClicked(statRef, ()=>setOrderStatForPrint([]))

  const [accessToken] = useToken();
  
  const getFoods = async()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getFoods`,{headers:{accessToken}})

      if(response.data.error){
        return;
      }
      setFoods(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    getFoods();
    getUnits();
    document.title = "اختصاص برنامه غذایی"
  },[])

  const selectFoodHandler = (date, foodId) => {
    setData(data.map(d=>{if(d.date===date){return {...d, orders: [{userId: user._id, food: foodId}]}}else{return d}}))
  }

  useEffect(() => {
    if(!fromDate || !toDate) return;
    loadData();
    loadStat();
  }, [fromDate, toDate])
  
  const loadData = async()=>{
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getOrders`,{
        fromDate, toDate
      },{headers:{accessToken}})
      if(response.data.error){
        return;
      }
      setData(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  const loadStat = async()=>{
    console.log(process.env.REACT_APP_BASE_URL)
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getOrderStat`,{
        fromDate, toDate
      },{headers:{accessToken}})
      if(response.data.error){
        return;
      }
      setStat(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  moment.loadPersian()

  const saveFoodPlanHandler = async()=>{
    // if(data.filter(d=>d.foods.length!==0 || d.type===2).length === 0) return;
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addOrUpdateOrders`,{
        data: data
      },{headers: {accessToken}})
      if(response.data.error){
        return;
      }
      loadData();
      loadStat();
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

  const getUnits = async()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getUnits`,{
        headers: {
          accessToken
        }
      })

      if(response.data.error){
        return
      }
      setUnits(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getStatHandler = async(id)=>{
    if(data.filter(d=>d._id===id)[0].foods.length === 0) return
    
    const date = data.filter(d=>d._id===id)[0].date;
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getOrderStatForPrint`,{
        id
      },{headers: {accessToken}})
      setOrderStatForPrint(response.data.sort((a,b)=>a.unitTitle - b.unitTitle))
    } catch (error) {
      console.log(error)
    }
  }

  const getExcelExport = (id)=>{
    if(data.filter(d=>d._id===id)[0].foods.length === 0) return
    const date = data.filter(d=>d._id===id)[0].date;
    const report = orderStatForPrint.sort((a,b)=>a.unitTitle - b.unitTitle).map(d=> d.orders.map((o)=>{return {'واحد': d.unitTitle, [`${o.foodTitle}`]:(o[`${o.foodTitle}`]?`${o[`${o.foodTitle}`]}/`:''+o.users.map(u=>u.name).join('/'))}})).flat(1);
    const rep = units.map(u=>report.filter(re=>re['واحد']===u.title).reduce((obj, item) => obj= {...obj, ...item}, {['واحد']:u.title}))
    const totalReport = data.filter(d=>d._id===id)[0].foods.map(f=>{return {'غذا':f===null?'لغو':foods.filter(ff=>ff._id===f)[0]?.title,'تعداد':stat[date]?.stat.filter(s=>s.food===f).length>0?stat[date]?.stat.filter(s=>s.food===f)[0].count:0}})
    totalReport.push({'غذا':'لغو','تعداد':stat[date]?.stat.filter(s=>s.food===null).length>0?stat[date]?.stat.filter(s=>s.food===null)[0].count:0})
    const fileName = moment(date, 'YYYY-MM-DD').locale('fa').format('jDD jMMMM jYYYY')
    convertJsonToExcel(rep, totalReport, fileName)
  }
  
  const convertJsonToExcel = (data, totalReport, fileName)=>{
    const workbook = XLSX.utils.book_new();
    // for (const ele in data) {
      // }
    const worksheet1 = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'سفارش واحد به واحد')
    const worksheet2 = XLSX.utils.json_to_sheet(totalReport);
    XLSX.utils.book_append_sheet(workbook, worksheet2, "سفارش کل")
    //Generate buffer
    XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});
    //Binary string
    XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});

    XLSX.writeFile(workbook, `گزارش ${fileName}.xlsx`)
  }

  return (
    <div
      className={`w-full mx-1 md:flex md:flex-col md:justify-start md:items-start text-sm`}
    >
      <div className="w-full flex justify-center items-center gap-4 select-none">
        <button onClick={()=>{setFromDate(moment(fromDate).subtract(7, 'day').format('YYYY-MM-DD'));setToDate(moment(toDate).subtract(7, 'day').format('YYYY-MM-DD'))}} className='text-gray-700 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 text-2xl'>{theme.direction==="rtl"?<MdOutlineNavigateNext/>:<MdOutlineNavigateBefore/>}</button>
        <button onClick={()=>{setFromDate(moment().startOf('week').format('YYYY-MM-DD'));setToDate(moment().endOf('week').format('YYYY-MM-DD'))}} className={`text-sm ${moment().startOf('week').format('YYYY-MM-DD') !== fromDate?'bg-teal-600 hover:bg-teal-500 text-white':'text-teal-600 dark:text-gray-200 font-bold'} rounded px-2`}>{moment().startOf('week').format('YYYY-MM-DD') !== fromDate?`${Math.abs(moment(fromDate).diff(moment().startOf('week'),'days') / 7)} هفته ${moment(fromDate).diff(moment().startOf('week'),'days') / 7<0?'قبل':'بعد'} (برو به هفته جاری)`:'هفته جاری'}</button>
        <button onClick={()=>{setFromDate(moment(fromDate).subtract(-7, 'day').format('YYYY-MM-DD'));setToDate(moment(toDate).subtract(-7, 'day').format('YYYY-MM-DD'))}} className='text-gray-700 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 text-2xl'>{theme.direction==="rtl"?<MdOutlineNavigateBefore/>:<MdOutlineNavigateNext/>}</button>
      </div>
      <hr className='w-full my-2'/>
      <div className="w-full grid grd-cols-1 md:grid-cols-7 gap-2 text-lg">
        {data.map((d,idx)=><div key={idx} className={`${moment(d.date).diff(moment().format('YYYY-MM-DD'), 'days') <= 0 && 'pointer-events-none'} select-none ${d.type===2 && 'bg-red-400 text-white text-xl font-bold'} w-full rounded-md border p-2 flex flex-col gap-2`}>
          <p className='text-center'>{['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'][idx]}</p>
          <p className='text-center text-sm'>{moment(fromDate).add(idx, 'day').format('jDD jMMMM jYYYY')}</p>
          <hr/>
          <div className="w-full grid grid-cols-2 text-sm">
            <button onClick={()=>setData(data.map(da=>{if(da.date===d.date){return {...da, type: 1}}else{return da}}))} className={`w-full rounded-s ${d.type===1?'bg-blue-400':'bg-gray-400'} hover:bg-blue-300`}>روزکاری</button>
            <button onClick={()=>setData(data.map(da=>{if(da.date===d.date){return {...da, type: 2}}else{return da}}))} className={`w-full rounded-e ${d.type===2?'bg-blue-400':'bg-gray-400'} hover:bg-blue-300`}>روزتعطیل</button>
          </div>
          {d.type===1 && 
            <div className='flex flex-col justify-between h-full'>
              <div className="">
                <p className='text-sm font-bold'>لیست غذا:</p>
                {foods.length > 0 && <MultiSelectComponent data={foods.map(f=>{return {_id: f._id, title: `${f.title} (${stat[d.date]?.stat.filter(s=>s.food===f._id).length>0?stat[d.date]?.stat.filter(s=>s.food===f._id)[0].count:0})`}})} fields={{title: 'title', value: '_id'}} value={d.foods?d.foods:[]} onChange={(s)=>setData(data.map(da=>{if(da.date===d.date){return {...da, foods: s, defaultFood:s[0]}}else{return da}}))}/>}
              </div>
              <div className="">
                <p className='text-xs'>{`لغو: (${stat[d.date]?.stat.filter(s=>s.food===null).length>0?stat[d.date]?.stat.filter(s=>s.food===null)[0].count:0})`}</p>
                <p className='text-sm font-bold'>غذای پیش فرض:</p>
                <DropDown className='w-full' data={[...foods.filter(f=> d.foods.includes(f._id)),{_id:1,title:'حضور ندارم'}]} fields={{title: 'title', value: '_id'}} value={d.defaultFood?d.defaultFood:1} onChange={(s)=>setData(data.map(da=>{if(da.date===d.date){return {...da, defaultFood: s}}else{return da}}))}/>
              </div>
            </div>}
        </div>)}
        <div className="col-span-1 md:col-span-7 flex justify-center items-center gap-4">
          <button onClick={()=>{saveFoodPlanHandler()}} className='bg-blue-400 text-white hover:bg-blue-300 rounded-md flex justify-center items-center gap-1 py-1 px-2 w-full md:w-1/3 text-2xl'><BiSave/><p className='text-lg'>ذخیره</p></button>
        </div>
        {data.map((d,idx)=><div key={idx} className={`${moment(d.date).diff(moment().format('YYYY-MM-DD'), 'days') <= 0 && 'pointer-events-none'} select-none ${d.type===2 && 'bg-red-400 text-white text-xl font-bold'} w-full rounded-md border p-2 flex flex-col gap-2`}>
          <p className='text-center'>{['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'][idx]}</p>
          <p className='text-center text-sm'>{moment(fromDate).add(idx, 'day').format('jDD jMMMM jYYYY')}</p>
          <p className='text-center text-sm'>{d.date}</p>
          <hr/>
          {d.type===1 && 
            <div className='flex flex-col justify-start h-full text-xs gap-2'>
            {d.foods.map((f,idx)=>
            <div key={idx} className="flex justify-between items-center">
              <p>{foods.filter(ff=>ff._id===f)[0]?.title}</p>
              <p>{stat[d.date]?.stat.filter(s=>s.food===f).length>0?stat[d.date]?.stat.filter(s=>s.food===f)[0].count:0}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
              <p>لغو</p>
              <p>{stat[d.date]?.stat.filter(s=>s.food===null).length>0?stat[d.date]?.stat.filter(s=>s.food===null)[0].count:0}</p>
          </div>
            </div>}
        </div>)}
        {data.map((d,idx)=> !stat[d.date] || stat[d.date].stat.filter(s=>s.food !== null).length === 0?<div key={idx}></div>:<button key={idx} onClick={()=>{getStatHandler(d._id);setCurrentDateId(d._id)}} className={`select-none ${d.type===2 && 'hidden'} w-full rounded-md border p-2 px-3 text-xs text-center bg-teal-400 hover:bg-teal-300`}>
        دریافت لیست رزرو
        </button>)}
        {orderStatForPrint.length > 0 && <div ref={statRef} className="fixed top-1/2 start-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col gap-2 bg-white border-2 rounded-md border-gray-500 p-2">
          <RiFileExcel2Fill onClick={()=>getExcelExport(currentDateId)} className='cursor-pointer text-green-500 hover:text-green-400'/>
          {orderStatForPrint.map((o, idx)=>
            <div key={idx} className="grid grid-cols-4 gap-2 border rounded p-2">
              <p className='col-span-1'>{o.unitTitle}</p>
              <div className="col-span-3 flex flex-col gap-2">
                {o.orders.map((or, oIdx)=><div key={oIdx} className='grid grid-cols-4 gap-2 border p-2'>
                  <p className='col-span-1 font-bold text-xs ms-2 whitespace-pre'>{or.foodTitle}</p>
                  <div className="col-span-3">
                    {or.users.map((ou, ouIdx)=><p key={ouIdx} className='text-xs ms-8'>{ou.name}</p>)}
                  </div>
              </div>
                )}
              </div>
            </div>
            )}
        </div>}
      </div>
    </div>
  );
};

export default FoodPlan