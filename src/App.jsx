import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layouts/Loaders';

// importing all pages routes
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Group = lazy(() => import("./pages/Group"));
const Chat = lazy(() => import("./pages/Chat"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));


const App = () => {

  const user = true;

  return (
    <Router>
      <Suspense fallback={<LayoutLoader/>}>
        <Routes>

          <Route element={<ProtectRoute user={user} />}>

            <Route path='/' element={
              <Home />
            } />
            <Route path='/about' element={
              <About />
            } />

            <Route path='/chat/:id' element={
              <Chat />
            } />
            <Route path='/groups' element={
              <Group />
            } />
          </Route>
          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/'>

              <Login />
            </ProtectRoute>
          } />


          <Route path='*' element={
            <PageNotFound />
          } />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App