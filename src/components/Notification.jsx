import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineCancel, MdPersonRemove } from 'react-icons/md';
import { BsPin, BsPinFill } from 'react-icons/bs';
import { HiSave } from 'react-icons/hi';
import { IoMdArrowRoundBack, IoMdClose } from 'react-icons/io';

import { Button, DropDown } from '.';
import { chatData } from '../data/dummy';
import { useSelector, useDispatch } from 'react-redux';
import {useTranslation} from 'react-i18next'
import { useScroll } from '../hooks/useScroll';
import useOutsideClicked from '../hooks/useOutsideClick';
import useToken from '../hooks/useToken';
import axios from 'axios';
import io from 'socket.io-client'
import { CgClose } from 'react-icons/cg';
import { AiOutlineUserDelete } from 'react-icons/ai';

const Notification = () => {
  const {t} = useTranslation();

  const {user, theme} = useSelector((state) => ({
    user: state.auth.user,
    theme: state.item
  }))

  const dispatch = useDispatch();
  const [accessToken, setToken] = useToken()
  const [users, setUsers] = useState([])
  const [panelUsers, setPanelUsers] = useState(false)
  const [chatRooms, setChatRooms] = useState([])
  const [currentChatRoom, setCurrentChatRoom] = useState(null)
  const [filterdUser, setFilterdUser] = useState('')
  const [showAddChatMenu, setShowAddChatMenu] = useState(false)
  const [addChat, setAddChat] = useState(null)
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([{user: user._id, role: 'owner'}])
  const [showMembers, setShowMembers] = useState(false)
  const [chatRoom, setChatRoom] = useState(null)

  const socketRef = useRef();
  
  useEffect(()=>{
    socketRef.current = io.connect(process.env.REACT_APP_SOCKET_APP_BASE_URL)
    socketRef.current.emit("get_chatRooms", user._id);
  },[])

  useEffect(()=>{
    socketRef.current.on("receive_chatRoom", ({chatRooms, users})=>{
      setChatRooms(chatRooms);
      setUsers(users);
    })
    return () => {
      socketRef.current.off("receive_chatRoom", ({chatRooms, users})=>{
        setChatRooms(chatRooms);
        setUsers(users);
      });
    }
  },[chatRooms])

  const handleClose = async() => {
    dispatch({
      type: "CLOSE_ITEM",
      value: "notification"
    })
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/updateMessengerState`,{
        id: user._id,
        messenger: false,
      },{
        headers: {
          accessToken
        }
      })

      if(response.data.error){
        return setErrorMsg(response.data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const notificationRef = useRef(null);
  useOutsideClicked(notificationRef, theme.pinChat?()=>{}:handleClose);

  const newChatGroupOrChannelRef = useRef(null);

  useOutsideClicked(newChatGroupOrChannelRef, ()=>{
    setShowAddChatMenu(false);
    setAddChat(null);
    setSelectedUsers([{user: user._id, role: 'owner'}]);
    setGroupName('')
  })

  // const getUsers = async()=>{
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getUsers`,{},{
  //       headers: {
  //         accessToken
  //       }
  //     })

  //     if(response.data.error){
  //       return setErrorMsg(response.data.error)
  //     }
  //     setUsers(response.data.users)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   getUsers();
  // },[])
  
  const pinChatHandler = async()=>{
    dispatch({
      type: "CHAT_SIDE",
      pinChat: !theme.pinChat
    })

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/updateMessengerState`,{
        id: user._id,
        messenger: !theme.pinChat,
      },{
        headers: {
          accessToken
        }
      })

      if(response.data.error){
        return setErrorMsg(response.data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const searchChatRoomHandler = async(id)=>{
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getChatRooms/${id}`,{
        userId: user._id
      },{
        headers: {
          accessToken
        }
      })

      if(response.data.error){
        return setErrorMsg(response.data.error)
      }
      setCurrentChatRoom(response.data.id)
      setChatRooms(response.data.chatRooms);
    } catch (error) {
      console.log(error)
    }
  }

  const addGroupOrChannelHandler = async()=>{
    console.log(groupName)
    if(groupName.trim() === '') return;
    socketRef.current.emit("add_group_or_channel",{
      userId: user._id,
      title: groupName,
      members: selectedUsers,
      type: addChat==='group'?2:3,
    })
    setGroupName('')
    setSelectedUsers([{user: user._id, role: 'owner'}]);
    setAddChat(null);
  }

  const showMembersHandler = async(id)=>{
    setShowMembers(!showMembers);
    if(showMembers) return;
    if(!showMembers){
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/getChatRoomById`,{
          roomId: id,
        },{headers: {accessToken}})
        setChatRoom(response.data)
      } catch (error) {
        
      }
    }
  }

  const changeRoleHandler = async (roomId, userId, role)=>{
    const newMembers = chatRoom.members.map(m=>{if(m.user._id===userId){return {user: userId, role: role}}else{return{user: m.user._id, role: m.role}}})
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/changeChatRoomMember`,{
        roomId, members: newMembers
      },{headers: {accessToken}})
      setChatRoom(response.data)
    } catch (error) {
      
    }
  }
  
  const [memberHover, setMemberHover] = useState(null)

  const removeMemberHandler = async (roomId, userId)=>{
    const newMembers = chatRoom.members.filter(m=>m.user._id !== userId).map(m=>{return{user:m.user._id, role:m.role}})
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/changeChatRoomMember`,{
        roomId, members: newMembers
      },{headers: {accessToken}})
      setChatRoom(response.data)
      setMemberHover(null)
    } catch (error) {
      
    }
  }

  const addUserHandler = async (roomId, userId)=>{
    const newMembers = [...chatRoom.members.map(m=>{return{user:m.user._id, role:m.role}}),{user:userId, role:'user'}]
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/changeChatRoomMember`,{
        roomId, members: newMembers
      },{headers: {accessToken}})
      setChatRoom(response.data)
    } catch (error) {
      
    }
  }

  const [memberFilter, setMemberFilter] = useState('')

  return (
    <div ref={notificationRef} style={{transition: "top 0.5s"}} className={`nav-item fixed ${theme.pinChat?'top-16 h-[calc(100vh-4rem)] flex flex-col start-1':'top-16 end-4 md:end-28'} bg-white dark:bg-[#42464D] p-3 rounded-lg w-96`}>
      
      {!currentChatRoom && <div className='w-full'>
        <div className="flex justify-between items-center gap-2">
          {theme.pinChat?<BsPinFill style={{color: theme.colorMode}} className='cursor-pointer text-lg' onClick={()=>pinChatHandler()}/>:<BsPin style={{color: theme.colorMode}} className='cursor-pointer text-lg' onClick={()=>pinChatHandler()}/>}
          <input type="text" placeholder={`${(panelUsers || addChat)?'جستجوی مخاطب':'جستجوی مکالمه'}`} className='border w-full flex-grow rounded px-2 py-1 text-xs text-gray-600 dark:text-gray-700' value={filterdUser} onChange={(e)=>setFilterdUser(e.target.value)}/>
          <MdOutlineCancel style={{color: theme.colorMode}} onClick={handleClose} className='text-xl cursor-pointer hover:text-red-500'/>
        </div>
        <div className={`mt-1 ${theme.pinChat?'h-[calc(100vh-8.75rem)]':'h-[20rem]'} overflow-y-auto w-full`}>
          {panelUsers && !addChat && users && users.length > 0 && users.filter(u=>u.name.indexOf(filterdUser) > -1).map((u, index) => (
            <div key={index} onClick={()=>{searchChatRoomHandler(u._id);setShowMembers(false)}} className="flex items-center cursor-pointer gap-2 border-b-1 border-color p-2">
              {u._id === user._id && <HiSave className="rounded-full h-10 w-10 text-gray-400 dark:text-gray-200"/>}
              {u._id !== user._id && <img className="rounded-full h-10 w-10" src={u.avatar} alt={u.avatar} />}
              <div>
              {u._id === user._id && <p className="font-semibold dark:text-gray-200 text-xs">فضای شخصی</p>}
              {u._id !== user._id && <p className="font-semibold dark:text-gray-200 text-xs">{u.name}</p>}
              {u._id !== user._id && <p className="text-gray-500 dark:text-gray-400 text-xs"> {u.role} </p>}
              </div>
            </div>
          ))}

          {!panelUsers && !addChat && chatRooms.length > 0 && chatRooms.filter(c=>(c.room.type === 0 && 'فضای شخصی'.indexOf(filterdUser) > -1) || (c.room.type > 1 && c.room.title.indexOf(filterdUser) > -1) || (c.room.type === 1 && c.room.members.filter(m=>m.user._id !== user._id)[0].user.name.indexOf(filterdUser) > -1)).map((c, index) => (
            <div key={index} onClick={()=>{setCurrentChatRoom(c.room._id);setShowMembers(false)}} className="flex items-center cursor-pointer w-[calc(100%-2rem)] gap-2 border-b-1 border-color p-2">
              {c.room.type === 0 && <HiSave className="rounded-full h-10 w-10 text-gray-400 dark:text-gray-200"/>}
              {c.room.type === 1 && <img className="rounded-full h-10 w-10" src={c.room.members.filter(m=>m.user._id !== user._id)[0].user.avatar} alt={c.room.members.filter(m=>m.user._id !== user._id)[0].user.avatar} />}
              {c.room.type > 1 && <img className="rounded-full h-10 w-10" src={c.room.image} alt={c.room.image} />}
              <div className='w-[calc(100%-0.5rem)]'>
                {c.room.type === 0 && <p className="font-semibold dark:text-gray-200 text-xs">فضای شخصی</p>}
                {c.room.type === 1 && <p className="font-semibold dark:text-gray-200 text-xs">{c.room.members.filter(m=>m.user._id !== user._id)[0].user.name}</p>}
                {c.room.type > 1 && <p className="font-semibold dark:text-gray-200 text-xs">{c.room.title}</p>}
                <p className="text-gray-500 dark:text-gray-400 text-[0.7rem] mt-1 truncate w-[calc(100%)]"> <span className='text-blue-600'>{c.lastUser}:</span>{c.lastMessage} </p>
              </div>
            </div>
          ))}
          {addChat && <div className='flex flex-col h-full'>
            <div className="flex justify-between items-center gap-1">
              <label className='text-xs' htmlFor="groupNameId">{addChat==='group'?'عنوان گروه:':'عنوان کانال:'}</label>
              <input id="groupNameId" placeholder='عنوان...' type="text" value={groupName} onChange={(e)=>setGroupName(e.target.value)} className="flex-grow rounded border text-sm px-2 py-1 dark:text-gray-600"/>
            </div>
            <div className="h-full flex-grow overflow-y-auto">
              {users.length > 0 && users.filter(u=>u.name.indexOf(filterdUser) > -1 && u._id !== user._id).map((u, index) => (
              <div key={index} className="flex justify-between items-center cursor-pointer gap-2 border-b-1 border-color p-2">
                <div className="flex items-center">
                  <input type="checkbox" checked={selectedUsers.filter(s=>s.user===u._id).length > 0} onChange={(e)=>{return e.target.checked?setSelectedUsers([...selectedUsers, {user: u._id, role: 'user'}]):setSelectedUsers(selectedUsers.filter(s=>s.user !== u._id))}}/>
                  <img className="rounded-full h-10 w-10" src={u.avatar} alt={u.avatar} />
                  <div>
                  <p className="font-semibold dark:text-gray-200 text-xs">{u.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{u.role}</p>
                  </div>
                </div>
                {selectedUsers.filter(s=>s.user===u._id).length >0 && <DropDown className=' ' beginFrom='end' data={[{title: 'کاربر عادی', value: 'user'},{title: 'ادمین', value: 'admin'}]} value={selectedUsers.filter(s=>s.user===u._id)[0].role} onChange={(s)=>setSelectedUsers(selectedUsers.map(su=>{if(su.user !== u._id){return su}else{return {user: u._id, role: s}}}))}/>}
              </div>))}
            </div>
            <div className="grid grid-cols-2 gap-2 justify-self-end mb-2">
              <button onClick={()=>{setAddChat(null); setSelectedUsers([{user: user._id, role: 'owner'}]); setGroupName('')}} className='rounded bg-amber-400 text-white'>انصراف</button>
              <button onClick={()=>addGroupOrChannelHandler()} className='rounded bg-green-400 text-white'>تائید</button>
            </div>
            </div>}
        </div>
        <div className="grid grid-cols-10 gap-1 mb-2 relative">
          {!addChat && <button onClick={()=>setPanelUsers(true)} className={`col-span-4 relative rounded bg-gray-200 dark:bg-gray-400 py-1 text-xs ${panelUsers && 'bg-gray-400 dark:bg-gray-500'}`}>مخاطبین
          {panelUsers && <div className="text-gray-500"><svg fill='currentcolor' xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 10 4" className='absolute top-0 w-full start-1/2 -translate-y-full translate-x-1/2'>
              <path d="M1 3 9 3C9.5 3 9.5 2.7 9 2.5L5.3.23C5.1.1 4.9.1 4.7.23L1.025 2.422C.548 2.685.46 2.987.987 2.987"></path>
            </svg></div>}
          </button>}
          {!addChat && <button onClick={()=>setPanelUsers(false)} className={`col-span-4 relative rounded bg-gray-200 dark:bg-gray-400 py-1 text-xs ${!panelUsers && 'bg-gray-400 dark:bg-gray-500'}`}>گفتگوها
            {!panelUsers && <div className="text-gray-500"><svg fill='currentcolor' xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 10 4" className='absolute top-0 w-full start-1/2 -translate-y-full translate-x-1/2'>
              <path d="M1 3 9 3C9.5 3 9.5 2.7 9 2.5L5.3.23C5.1.1 4.9.1 4.7.23L1.025 2.422C.548 2.685.46 2.987.987 2.987"></path>
            </svg></div>}
          </button>}
          {!addChat && <button onClick={()=>setShowAddChatMenu(true)} className={`absolute end-0 bottom-0 w-10 aspect-square rounded-full text-3xl text-white bg-blue-400`}>+</button>}
            <div ref={newChatGroupOrChannelRef} onClick={()=>setShowAddChatMenu(false)} className={`${!showAddChatMenu && 'hidden'} absolute end-0 top-0 -translate-y-24 -translate-x-2 rounded-t rounded-s p-1 text-xs text-white bg-blue-400`}>
              <div onClick={()=>{setAddChat('group');setSelectedUsers([{user: user._id, role: 'owner'}]); setGroupName('')}} className='rounded bg-gray-500 text-white px-2 py-1 my-1 cursor-pointer hover:bg-gray-600'>ایجاد گروه</div>
              <div onClick={()=>{setAddChat('channel');setSelectedUsers([{user: user._id, role: 'owner'}]); setGroupName('')}} className='rounded bg-gray-500 text-white px-2 py-1 my-1 cursor-pointer hover:bg-gray-600'>ایجاد کانال</div>
            </div>
            <div className="text-blue-400"><svg fill='currentcolor' xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 5 5" className={`${!showAddChatMenu && 'hidden'} absolute top-0 end-0 -translate-y-8 -translate-x-2`}>
              <path d="M0 5 0 0 5 0C2 1 1 2 0 5"></path>
            </svg></div>
        </div>
      </div>}
      {currentChatRoom && 
      <div className="relative flex flex-col h-full">
        <div className="flex justify-between items-center">
          {theme.pinChat?<BsPinFill style={{color: theme.colorMode}} className='cursor-pointer text-lg' onClick={()=>pinChatHandler()}/>:<BsPin style={{color: theme.colorMode}} className='cursor-pointer text-lg' onClick={()=>pinChatHandler()}/>}
          <input type="text" placeholder='جستجوی پیام' className='border w-full flex-grow rounded px-2 py-1 text-xs text-gray-600 dark:text-gray-700' value={filterdUser} onChange={(e)=>setFilterdUser(e.target.value)}/>
          <MdOutlineCancel style={{color: theme.colorMode}} onClick={handleClose} className='text-xl cursor-pointer hover:text-red-500'/>
        </div>
        <div className="flex justify-between items-start w-full">
          {chatRooms.filter(c=>c.room._id===currentChatRoom).map((c, index)=>
            <div key={index} onClick={()=>{setCurrentChatRoom(c.room._id)}} className="flex items-center cursor-pointer gap-2 p-2">
            {c.room.type === 0 && <HiSave className="rounded-full h-10 w-10 text-gray-400 dark:text-gray-200"/>}
            {c.room.type === 1 && <img className="rounded-full h-10 w-10" src={c.room.members.filter(m=>m.user._id !== user._id)[0].user.avatar} alt={c.room.members.filter(m=>m.user._id !== user._id)[0].user.avatar} />}
            <div>
            {c.room.type === 0 && <p className="font-semibold dark:text-gray-200 text-xs">فضای شخصی</p>}
            {c.room.type === 1 && <p className="font-semibold dark:text-gray-200 text-xs">{c.room.members.filter(m=>m.user._id !== user._id)[0].user.name}</p>}
            {c.room.type > 1 && <p onClick={()=>showMembersHandler(c.room._id)} className="font-semibold dark:text-gray-200 text-xs">{c.room.title} (اعضای {c.room.type===2?'گروه':'کانال'})</p>}
            {/* {u._id !== user._id && <p className="text-gray-500 dark:text-gray-400 text-xs"> {u.role} </p>} */}
            </div>
          </div>
          )}
          <IoMdArrowRoundBack className='text-xl text-gray-400 cursor-pointer' onClick={()=>setCurrentChatRoom(null)}/>
        </div>

        <hr className='mb-1'/>
        <ChatRoom className={`${theme.pinChat?'flex-grow':'h-[20rem]'} w-full`} roomId={currentChatRoom} showMembers={showMembers} filterTxt={filterdUser}/>
        <div className={`${!showMembers && 'hidden'} absolute w-full h-full flex justify-center items-center p-8`}>
              <div className="bg-blue-200 dark:bg-cyan-900 h-full w-full flex flex-col rounded-md p-2">
                <div className="w-full flex justify-between items-center text-sm font-bold">
                  {chatRoom && <p>{`اعضای ${chatRoom.type===2?'گروه':'کانال'}`}</p>}
                  <IoMdClose className='cursor-pointer hover:text-red-500 dark:hover:text-amber-500' onClick={()=>setShowMembers(false)}/>
                </div>
                <hr className='border-blue-500 dark:border-amber-500 my-2'/>
                <div className="flex flex-col gap-2 mb-2 max-h-[50%] overflow-y-auto">
                  {chatRoom && chatRoom.members.map((m, idx)=>
                  <div key={idx} className="flex justify-between items-center w-full gap-1">
                    <p onMouseEnter={()=>{if(['user','admin','owner'].indexOf(m.role)<['user','admin','owner'].indexOf(chatRoom.members.filter(mm=>mm.user._id===user._id)[0].role) || m.user._id.toString() === user._id.toString()){setMemberHover(m.user._id)}}} onMouseLeave={()=>setMemberHover(null)} className='flex justify-start items-center gap-1 text-xs cursor-pointer'>{m.user.name}<AiOutlineUserDelete className={`${memberHover !== m.user._id && 'hidden'} text-lg text-red-400`}/><p onClick={()=>{removeMemberHandler(chatRoom._id, m.user._id)}} className={`${memberHover !== m.user._id && 'hidden'} text-red-400`}>حذف</p></p>
                    {m.role!=='owner' && chatRoom.members.filter(mm=>mm.user._id===user._id)[0].role!=='user' && <DropDown className='text-[0.6rem]' paddingY='py-0' beginFrom='end' data={[{title: 'کاربر عادی', value: 'user'},{title: 'مدیر', value: 'admin'}]} value={m.role} onChange={(s)=>{changeRoleHandler(chatRoom._id, m.user._id, s)}}/>}
                    {chatRoom.members.filter(mm=>mm.user._id===user._id)[0].role==='user' && <p className='text-xs pb-1'>{m.role==='admin'?'مدیر':m.role==='user'?'کاربرعادی':''}</p>}
                    {m.role==='owner' && <p className='text-xs pb-1'>سازنده</p>}
                  </div>
                  )}
                </div>
                <hr className='border-blue-500 dark:border-amber-500 my-2'/>
                <input type="text" placeholder='جستجوی کاربر' className='w-full rounded px-2 py-1 text-xs dark:text-gray-700 mb-2' value={memberFilter} onChange={(e)=>setMemberFilter(e.target.value)}/>
                <div className="flex-grow rounded-md border border-blue-500 dark:border-amber-500 overflow-y-auto">
                  {chatRoom && users && users.filter(u=>u.name.indexOf(memberFilter)>-1 && !chatRoom.members.map(m=>m.user._id).includes(u._id)).map(u=>
                    <div className='text-xs mb-1 flex justify-between items-center p-1'>
                      <p>{u.name}</p>
                      <div onClick={()=>addUserHandler(chatRoom._id, u._id)} className="text-blue-500 dark:text-amber-500 hover:bg-blue-500 hover:dark:bg-amber-500 hover:text-blue-200 hover:dark:text-cyan-900 cursor-pointer rounded text-[0.7rem] px-1 py-1">افزودن</div>
                    </div>
                    )}
                </div>
              </div>
        </div>
      </div>
      }
    </div>
  );
};

export default Notification;
