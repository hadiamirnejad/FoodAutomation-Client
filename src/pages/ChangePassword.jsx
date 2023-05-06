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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'left',
    },
  },
};

const ChangePassword = () => {
  const { user, theme } = useSelector((state) => ({
    theme: state.item,
    user: state.auth.user
  }));

  const dispatch = useDispatch();

  const [accessToken] = useToken();
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const updatePasswordHandler = async()=>{
    if(newPassword !== newPasswordConfirm){
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'خطا',
          description: 'رمز عبور جدید با تکرارش یکسان نیست.',
          type: 'error'
        },
      });
      return setErrorMsg('رمز عبور جدید با تکرارش یکسان نیست.')
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/changePassword`,{
        userId: user._id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      },{accessToken})

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
        setErrorMsg(response.data.error)
        return;
      }
      setSuccessMsg('تغییر رمز با موفقیت انجام شد.')
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: Math.floor(Math.random()*3000),
          title: 'عملیات موفق',
          description: 'تغییر رمز با موفقیت انجام شد.',
          type: 'success'
        },
      });

    } catch (error) {
      setErrorMsg(error)
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


  return (
    <div
      className={`mx-1 max-w-full box-border bg-white dark:bg-secondary-dark-bg p-2 md:transition-2 pt-4 mt-[4.25rem] text-sm`}
    >
      <div className="flex justify-center items-center w-full gap-2">
        <div className="w-1/3">
          <div className="grid grid-cols-2 mb-2 justify-center items-center">
            <label htmlFor="pssword1">رمز عبور فعلی:</label>
            <input id='pssword1' type="password" className='border rounded dark:text-gray-500 px-2 py-1' placeholder='رمز عبور فعلی' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 mb-2 justify-center items-center">
            <label htmlFor="pssword2">رمز عبور جدید:</label>
            <input id='pssword2' type="password" className='border rounded dark:text-gray-500 px-2 py-1' placeholder='رمز عبور جدید' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 mb-2 justify-center items-center">
            <label htmlFor="pssword3">تکرار رمز عبور جدید:</label>
            <input id='pssword3' type="password" className='border rounded dark:text-gray-500 px-2 py-1' placeholder='تکرار رمز عبور جدید' value={newPasswordConfirm} onChange={(e)=>setNewPasswordConfirm(e.target.value)}/>
          </div>
          <div className="grid grid-cols-1 mb-2 justify-center items-center">
            <button onClick={updatePasswordHandler} className="border dark:border-none rounded bg-teal-500 w-full py-1">ثبت</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
