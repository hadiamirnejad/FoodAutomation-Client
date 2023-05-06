import React, { useEffect, useRef, useState } from 'react';
import { DropDown, Header, RadioButton } from '../components';
import { GrLocation } from 'react-icons/gr';
import axios from 'axios';
import useToken from '../hooks/useToken';
import './UserManegement.css'
import { useDispatch, useSelector } from 'react-redux';
import useOutsideClicked from '../hooks/useOutsideClick';

const UserManegement = () => {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const toolbarOptions = ['Search'];

  const [accessToken, setToken] = useToken()

  const editing = { allowDeleting: true, allowEditing: true };
  const [units, setUnits] = useState([])
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [username, setUserName] = useState('')
  const [role, setRole] = useState('')
  const [unit, setUnit] = useState(null)
  const [editingId, setEditingId] = useState('')

  const dispatch = useDispatch();

  const getUsers = async()=>{
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getUsers`,{},{
        headers: {
          accessToken
        }
      })

      if(response.data.error){
        return;
      }
      setUsers(response.data.users)
    } catch (error) {
      console.log(error)
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

  useEffect(() => {
    getUnits();
  }, [])

  useEffect(() => {
    getUsers();
  }, [units])

  const editUserHandler = (id)=>{
    const editingUser = users.filter(u=> u._id === id)
    setEditingId(editingUser[0]._id)
    setName(editingUser[0].name)
    setUserName(editingUser[0].username)
    setRole(editingUser[0].role)
    setUnit(editingUser[0].unit._id)
  }

  const deactiveUserHandler = async(id)=>{
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/deactiveUser`,{
        id,
        activeStatus: !users.filter(u=>u._id===id)[0].active
      },{
        headers:{accessToken}
      })

      if(response.data.error){
        dispatch({
          type: "ADD_TOAST",
          toast: {
            id: Math.floor(Math.random()*3000),
            title: 'خطا',
            description: response.data.error,
            type: 'error'
          },
        });
        return;
      }

      setUsers(users.map(u=>{if(u._id===response.data.updatedUser._id){return response.data.updatedUser}else{return u}}))
      const aUser = users.filter(u=>u._id===id)[0];
      cancelHandler();
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'عملیات موفق',
          description: `${aUser.name} با موفقیت ${aUser.active?'غیرفعال':'فعال'} شد.`,
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

  const resetUserPasswordHandler = async(id)=>{
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/resetPassword`,{
        id,
      },{
        headers:{accessToken}
      })

      if(response.data.error){
        dispatch({
          type: "ADD_TOAST",
          toast: {
            id: Math.floor(Math.random()*3000),
            title: 'خطا',
            description: response.data.error,
            type: 'error'
          },
        });
        return;
      }
      const aUser = users.filter(u=>u._id===id)[0];
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'عملیات موفق',
          description: `رمز ورود ${aUser.name} به 123456 تغییر یافت.`,
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

  const cancelHandler = () => {
    setEditingId('')
    setName('')
    setUserName('')
    setRole('')
    setUnit(null)
  }

  const submitHandler = async() => {
    if(!username || !name || !role){
      return dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'خطا',
          description: 'پارامترها به درستی وارد نشده‌اند.',
          type: 'error'
        },
      });
    }
    if(editingId === ''){
      insertUser();
    }
    else{
      updateUser();
    }
  }

  const insertUser = async() => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addUser`,{
        username: username,
        name: name,
        role: role,
        unit: unit
      },{
        headers:{accessToken}
      })

      if(response.data.error){
        return;
      }

      setUsers([...users, response.data])
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'عملیات موفق',
          description: 'کاربر با موفقیت اضافه شد.',
          type: 'success'
        },
      });
      cancelHandler();
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

  const updateUser = async() => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/editUser`,{
        id: editingId,
        username: username,
        name: name,
        role: role,
        unit: unit
      },{
        headers:{accessToken}
      })

      if(response.data.error){
        return
      }

      setUsers(users.map(u=>{if(u._id===response.data.updatedUser._id){return response.data.updatedUser}else{return u}}))
      cancelHandler();
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'عملیات موفق',
          description: `${name} با موفقیت ویرایش شد.`,
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

  const roles = [{
    title: 'ادمین',
    value: 'admin'
  },
  {
    title: 'کاربرعادی',
    value: 'user'
  }]
  return (
    <div className='mt-20'>
      <div className="m-2 md:m-5 mt-20 p-2 md:p-10 bg-white dark:bg-[#42464D] rounded-3xl">
        <Header category="مدیریت کاربران"/>
        <div className={`sticky z-50 top-12 w-full mb-4 text-sm rounded border p-2 ${editingId !== ''?'bg-orange-200 dark:bg-amber-600':'bg-gray-300 dark:bg-gray-500'}`}>
          <p className='text-sm my-2 font-bold'>{editingId !==''?`ویرایش اطلاعات ${users.filter(u=>u._id===editingId)[0].name}`:'اضافه کردن کاربر جدید'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-1">
            <div className="col-span-1 flex justify-between items-center w-full">
              <label htmlFor="name" className='dark:text-white whitespace-pre'>نام نمایشی:</label>
              <input id="name" className='p-1 px-2 rounded mx-1 bg-transparent border w-full' placeholder='نام نمایشی' type="text" value={name} onChange={(e)=> setName(e.target.value)}/>
            </div>
            <div className="col-span-1 flex justify-between items-center w-full">
              <label htmlFor="username" className='dark:text-white whitespace-pre'>نام کاربری:</label>
              <input id="username" className='p-1 px-2 rounded mx-1 bg-transparent border w-full' placeholder='نام کاربری' type="text" value={username} onChange={(e)=> setUserName(e.target.value)}/>
            </div>
            <div className="col-span-1 flex justify-between items-center w-full">
              <label htmlFor="username" className='dark:text-white whitespace-pre'>واحد:</label>
              <DropDown className='p-1 px-2 rounded mx-1 bg-transparent w-full' data={units} fields={{title: 'title', value: '_id'}} value={unit} onChange={(s)=>{setUnit(s)}}/>
            </div>
            <div className="col-span-1 flex items-center justify-start gap-2">
              <label htmlFor="role" className='dark:text-white'>نقش کاربر:</label>
              {/* <DropDownListComponent id="role" ignoreAccent={true} dataSource={roles} fields={{ text: 'title', value: 'value' }} value={role} onChange={(e)=>{setRole(e.value)}} allowFiltering={true} placeholder="نقش" filterBarPlaceholder="" /> */}
              {/* <DropDown setValue={setRole} data={roles} placeHolder={role === ''?'انتخاب کنید...':roles.filter(r=>r.value===role)[0].title}/> */}
              <RadioButton onChange={(selectedValue)=>setRole(selectedValue)} value={role} data={roles} fileds={{title: 'title', value: 'value'}} fill={theme.themeMode==="Light"?'#000000':'#FFFFFF'}/>
            </div>
            <div className="col-span-1 flex items-center justify-end gap-2 w-full">
              {editingId && <button onClick={() => cancelHandler()} className='rounded p-1 w-1/2 hover:bg-gray-700 text-white bg-gray-600'>انصراف</button>}
              <button onClick={() => submitHandler()} className='rounded p-1 w-1/2 bg-blue-400 hover:bg-blue-300 text-white'>{editingId !== ''?'ویرایش':'ثبت'}</button>
            </div>
          </div>
        </div>
        <div className="sticky z-0 top-32 w-full grid grid-cols-2 md:grid-cols-5 text-xs dark:text-white mt-8 h-12 md:h-6 rounded bg-gray-300 dark:bg-gray-500">
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p>نام نمایشی</p>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p>نام کاربری</p>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p>واحد</p>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p>نقش</p>
            </div>
            <div className="flex justify-around items-center">
              <p>عملیات</p>
            </div>
        </div>
        {users.map((u, idx)=>(
          <div key={idx} className={`w-full grid grid-cols-2 md:grid-cols-5 text-sm dark:text-white border-1 rounded p-2 my-1`}>
            <div className="col-span-1 flex justify-start items-center gap-2 no-underline">
              <p>{idx+1}- </p>
              <img src={u.avatar} alt={u.username} className='rounded-full w-12 h-12' />
              <p className={`${!u.active && 'line-through'}`}>{u.name}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p className={`${!u.active && 'line-through'}`}>{u.username}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p className={`${!u.active && 'line-through'}`}>{u.unit.title}</p>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-2">
              <p className={`${!u.active && 'line-through'}`}>{roles.filter(r=> r.value===u.role)[0].title}</p>
            </div>
            <div className="flex justify-around items-center no-underline gap-2">
              <button onClick={()=>editUserHandler(u._id)} className='rounded whitespace-pre bg-blue-400 p-1 w-24 hover:bg-gray-500 text-xs'>ویرایش</button>
              <button onClick={()=>resetUserPasswordHandler(u._id)} className='rounded whitespace-pre bg-cyan-400 p-1 w-24 hover:bg-gray-500 text-xs'>ریست رمزعبور</button>
              <button onClick={()=>deactiveUserHandler(u._id)} className={`rounded whitespace-pre ${u.active?'bg-green-400':'bg-gray-500'} p-1 w-24 hover:bg-gray-500 text-xs`}>{u.active?'فعال':'غیرفعال'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UserManegement;
