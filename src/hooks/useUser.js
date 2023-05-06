import axios from "axios";
import { useState, useEffect } from "react";
import useToken from "./useToken";
import { useDispatch } from "react-redux";

function useUser() {
  const [accessToken] = useToken();

  const dispatch = useDispatch();
  const [user, setUser] = useState(null)

  if(!accessToken){
    setUser(null)
  }
  else{
    try {
      const response = axios.get(
        `${process.env.REACT_APP_BASE_URL}/checkToken`,
        {
          headers: { accessToken },
        }
      ).then(()=>{
          dispatch({
            type: "LOG_IN",
            user: response.data.user,
          })
          setUser(response.data.user)
        }
      );
    } catch (err) {
      setUser(null)
    }
  }  
  return user;
}

export default useUser;
