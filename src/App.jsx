import React,{lazy} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// importing all pages routes
const Home = lazy(()=>import("./pages/Home"));
const About = lazy(()=>import("./pages/About"));
const Login = lazy(()=>import("./pages/Login"));
const Group = lazy(()=>import("./pages/Group"));
const Chat = lazy(()=>import("./pages/Chat"));


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={
        <Home/>
        }/>
        <Route path='/about' element={
        <About/>
        }/>
        <Route path='/login' element={
        <Login/>
        }/>
        <Route path='/chat/:id' element={
        <Chat/>
        }/>
        <Route path='/groups' element={
        <Group/>
        }/>
      </Routes>
    </Router>
  )
}

export default App