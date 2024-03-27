import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layouts/Loaders';
import axios from "axios";
import { server } from './constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth';
import {Toaster} from "react-hot-toast";


// importing admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const MessageMangement = lazy(() => import("./pages/admin/MessageMangement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

// importing all pages routes
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Group = lazy(() => import("./pages/Group"));
const Chat = lazy(() => import("./pages/Chat"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
import {SocketProvier} from "./socket"


const App = () => {

  const { user, loader } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/user/myprofile`, {
        withCredentials:true
      })
      .then(({data}) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));

  }, [dispatch]);


  return loader ? <LayoutLoader />: (
    <Router>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>

          <Route element={<SocketProvider>
            <ProtectRoute user={user} />
          </SocketProvider>}>

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

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/chats' element={<ChatManagement />} />
          <Route path='/admin/messages' element={<MessageMangement />} />

          <Route path='*' element={
            <PageNotFound />
          } />
        </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </Router>
  )
}

export default App