import { useState } from 'react'

function useToken() {
  const [token, setTokenInternal] = useState(() => {
    return localStorage.getItem('accessToken')
  })

  const setToken = newToken => {
    localStorage.setItem('accessToken', newToken);
    setTokenInternal(newToken)
  }
  return [token, setToken]
}

export default useToken