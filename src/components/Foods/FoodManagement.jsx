import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi';
import { TiTick } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import useToken from '../../hooks/useToken';
import MultiSelectComponent from '../MultiSelectComponent';

function FoodManagement() {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const dispatch = useDispatch();
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryTitleFilter, setCategoryTitleFilter] = useState('')
  const [edittingCategory, setEdittingCategory] = useState(null)
  const [categoryTitle, setCategoryTitle] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryColor, setCategoryColor] = useState(null)
  const [foodTitleFilter, setFoodTitleFilter] = useState('')
  const [foodCategoriesFilter, setFoodCategoriesFilter] = useState([])
  const [edittingFood, setEdittingFood] = useState(null)
  const [foodTitle, setFoodTitle] = useState('')
  const [foodCategories, setFoodCategories] = useState([])
  const [accessToken] = useToken();
  const colors = ['#78909c','#42a5f5', '#ce93d8','#ffa726','#26c6da','#8bd346','#fb7185','#10b981'];

  
  const getCategories = async()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getCategories`,{headers:{accessToken}})

      if(response.data.error){
        return;
      }
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }

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

  useEffect(()=>{
    getFoods();
    getCategories();
  },[])

  const addCatgotyHandler = async()=>{
    if(categoryTitle.trim() === '') return;
    if(categories.filter(c=>c.title.replaceAll(" ","")===categoryTitle.replaceAll(" ","")).length > 0){
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'خطا',
          description: 'این دسته قبلاً اضافه شده است.',
          type: 'error'
        },
      });
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addCategory`,{
        id: edittingCategory, title: categoryTitle.trim(), description: categoryDescription, color: categoryColor
      },{headers:{accessToken}})

      if(response.data.error){
        return console.log(categoryTitle);
      }
      getCategories();
      getFoods();
      resetCategoryHandler();
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

  const resetCategoryHandler = ()=>{
    setEdittingCategory(null);
    setCategoryTitle('');
    setCategoryDescription('');
    setCategoryColor('')
  }

  const addFoodHandler = async()=>{
    if(foodTitle.trim() === '') return;
    if(foods.filter(f=>f.title.replaceAll(" ","")===foodTitle.replaceAll(" ","")).length > 0){
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'خطا',
          description: 'این عنوان غذا قبلاً اضافه شده است.',
          type: 'error'
        },
      });
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addFood`,{
        id: edittingFood, title: foodTitle.trim(), categories: foodCategories
      },{headers:{accessToken}})

      if(response.data.error){
        return console.log(response.data.error);
      }
      getFoods();
      resetFoodHandler();
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
  
  const resetFoodHandler = ()=>{
    setEdittingFood(null);
    setFoodTitle('');
    setFoodCategories([])
  }

  return (
    <>
      <div className="w-full grid grd-cols-1 md:grid-cols-4 gap-2 text-lg">
        <div className="col-span-1 relative rounded border h-full p-2 pt-8 overflow-y-auto">
          <div className="absolute top-0 start-0 w-full border border-gray-500 bg-gray-500 text-white font-bold rounded-t px-2 text-center">افزودن یا ویرایش دسته</div>
          <label htmlFor="categoryTitleId" className='text-sm'>عنوان دسته:</label>
          <input id="categoryTitleId" autoComplete='off' placeholder='عنوان دسته را وارد کنید' type="text" className='border rounded bg-transparent text-sm px-2 py-1 w-full mb-2' value={categoryTitle} onChange={(e)=>setCategoryTitle(e.target.value)}/>
          <label htmlFor="categoryDescriptionId" className='text-sm'>توضیحات دسته:</label>
          <input id="categoryDescriptionId" autoComplete='off' placeholder='توضیحات دسته را وارد کنید' type="text" className='border rounded bg-transparent text-sm px-2 py-1 w-full mb-2' value={categoryDescription} onChange={(e)=>setCategoryDescription(e.target.value)}/>
          <p className='text-sm'>رنگ دسته:</p>
          <div className="w-full rounded border py-1 px-2 grid grid-cols-12 gap-1 mb-2">
            {colors.map((c,index)=><div key={index} style={{background: `${c}50`}} className='cursor-pointer aspect-square border text-lg rounded-full flex justify-center items-center' onClick={()=>{setCategoryColor(c)}}>{c===categoryColor && <TiTick/>}</div>)}
          </div>
          <div className="flex justify-between items-center gap-2 text-sm">
            {edittingCategory && <button onClick={()=>{resetCategoryHandler()}} className='w-[calc(50%-0.25rem)] border bg-red-400 hover:bg-red-300 text-white rounded py-1 px-2'>انصراف</button>}
            <button onClick={()=>addCatgotyHandler()} className='flex-grow border bg-teal-600 hover:bg-teal-500 text-white rounded py-1 px-2'>{`${edittingCategory?'ثبت تغییرات':'ثبت'}`}</button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 rounded border h-full p-2 overflow-y-auto">
          <div className="w-full">
            <input placeholder='برای جستجو عنوان دسته را وارد کنید' autoComplete='off' type="text" className='border rounded bg-transparent text-sm px-2 py-1 w-full mb-2' value={categoryTitleFilter} onChange={(e)=>setCategoryTitleFilter(e.target.value)}/>
          </div>
          <div className="flex flex-wrap justify-start items-start w-full gap-1">
            {categories.filter(c=>c.title.indexOf(categoryTitleFilter)>-1).map((c,index)=><div key={index} style={{background: `${c?.color}50`}} className='flex justify-between items-center text-sm w-[calc(100%/2-0.125rem)] md:w-[calc(100%/6-0.25rem)] rounded border px-2 py-1'>
              <p>{c.title}</p>
              <button onClick={()=>{setEdittingCategory(c._id);setCategoryTitle(c.title);setCategoryDescription(c.description);setCategoryColor(c.color)}} className='cursor-pointer'><BiEdit/></button>
            </div>)}
          </div>
        </div>
      </div>
      <hr className='w-full rounded border-2'/>
      <div className="w-full flex-grow grid grd-cols-1 md:grid-cols-4 gap-2 text-lg">
        <div className="col-span-1 relative rounded border h-full p-2 pt-8 overflow-y-auto">
          <div className="absolute top-0 start-0 w-full border border-gray-500 bg-gray-500 text-white font-bold rounded-t px-2 text-center">افزودن یا ویرایش غذا</div>
          <label htmlFor="foodTitleId" className='text-sm'>عنوان غذا:</label>
          <input id="foodTitleId" placeholder='عنوان غذا را وارد کنید' autoComplete='off' type="text" className='border rounded bg-transparent text-sm px-2 py-1 w-full mb-2' value={foodTitle} onChange={(e)=>setFoodTitle(e.target.value)}/>
          <label htmlFor="foodCategoryId" className='text-sm'>دسته غذا:</label>
          {/* <input id="foodCategoryId" placeholder='دسته غذا را وارد کنید' type="text" className='border bg-transparent text-sm px-2 py-1 w-full mb-2' value={foodCategories} onChange={(e)=>setFoodCategories(e.target.value)}/> */}
          <MultiSelectComponent className='border rounded mb-2' fontSize='text-sm' placeholder='دسته را انتخاب کنید...' data={categories} value={foodCategories} fields={{title: 'title', value: '_id'}} onChange={(s)=>setFoodCategories(s)}/>
          {/* <button onClick={()=>addFoodHandler()} className='w-full border bg-teal-600 hover:bg-teal-500 text-white rounded py-1 px-2'>ثبت</button> */}
          <div className="flex justify-between items-center gap-2 text-sm">
            {edittingFood && <button onClick={()=>{resetFoodHandler()}} className='w-[calc(50%-0.25rem)] border bg-red-400 hover:bg-red-300 text-white rounded py-1 px-2'>انصراف</button>}
            <button onClick={()=>addFoodHandler()} className='flex-grow border bg-teal-600 hover:bg-teal-500 text-white rounded py-1 px-2'>{`${edittingFood?'ثبت تغییرات':'ثبت'}`}</button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 rounded border h-full p-2 overflow-y-auto">
          <div className="w-full flex justify-between items-center gap-2">
            <input id="foodTitleId" autoComplete='off' placeholder='برای جستجو عنوان غذا را وارد کنید' type="text" className='border rounded bg-transparent text-sm px-2 py-1 w-full mb-2' value={foodTitleFilter} onChange={(e)=>setFoodTitleFilter(e.target.value)}/>
            <MultiSelectComponent className='border rounded mb-2' fontSize='text-sm' placeholder='دسته را انتخاب کنید...' data={categories} value={foodCategoriesFilter} fields={{title: 'title', value: '_id'}} onChange={(s)=>setFoodCategoriesFilter(s)}/>
          </div>
          <div className="flex flex-wrap justify-start items-start w-full gap-1">
            {foods.filter(f=>f.title.indexOf(foodTitleFilter)>-1 && foodCategoriesFilter.every(c=>f.categories.map(fc=>fc._id).includes(c))).map((f,index)=><div key={index} style={{background: f.categories.length === 1?`${f.categories[0].color}50`:`linear-gradient(90deg, ${f.categories.map(c=>`${c.color}50`).join(',')})`}} className='flex justify-between items-center text-sm w-[calc(100%)] md:w-[calc(100%/4-0.25rem)] rounded border px-2 py-1'>
              <p>{f.title}</p>
              <button onClick={()=>{setEdittingFood(f._id);setFoodTitle(f.title);setFoodCategories(f.categories.map(c=>c._id))}} className='cursor-pointer'><BiEdit/></button>
            </div>)}
          </div>
        </div>
      </div>
    </>
  )
}

export default FoodManagement