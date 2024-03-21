import { createContext, useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About'
import Register from './components/Register';
import Login from './components/Login';
import ErrorPage from './components/ErrorPage';

import { initialState, reducer } from './reducer/UseReducer';

export const UserContext = createContext();

const Routing = () =>{
  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/AboutUs' element={<About />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Login' element={<Login />} />
      <Route path='*' element={<ErrorPage/>}/>
    </Routes>
  )
}



function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (

    <div className="App">

      <UserContext.Provider value={{state, dispatch}}>

        <Navbar/>
        <Routing/>

      </UserContext.Provider>

    </div>
  );
}

export default App;
