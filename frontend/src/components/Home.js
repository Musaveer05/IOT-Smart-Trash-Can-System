import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  const callHomePage = async () =>{

    console.log('calling')

    try {
      const res = await fetch('/Home',{
        method: 'GET',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials:'include'
      })
      
      const data = await res.json()
      console.log(data)
      if (!res.status === 200) throw new Error(res.error)
  
    } catch (err) {
      console.log(err)
      navigate('/login');
    }

    

  }

  useEffect(() =>{
    callHomePage();
  }, [])

  return (
    <>
    <h1>This is home page</h1>
    </>
  )
}

export default Home