import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import './base.css';
import Register from './components/register';
import Login from './components/login';
import Logout from './components/logout';
import Admin from './components/admin';
import Profile from './components/profile';
import Home from './components/home';
import Calculate from './components/calculate';


function App() {
	return (
		<Routes>
			<Route path='/register' element={ <Register /> } />
			<Route path='/login' element={ <Login /> } />
			<Route path='/logout' element={ <Logout /> } />
			<Route path='/admin' element={ <Admin /> } />
			<Route path='/profile' element={ <Profile /> } />
			<Route path='/home' element={ <Home /> } />
			<Route path='/calculate' element={ <Calculate /> } />
			<Route path='/' element={ <Navigate to='/login'/> } />
		</Routes>
	);
}

export default App;
