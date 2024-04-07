import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Bill from './components/Bill.jsx';
import History from './components/History.jsx';
import About from './components/About.jsx';

const mainRoutes=createBrowserRouter([
    {path:"/",element:<App/>,children:[
        {path:"/register",element:<Signup/>},
        {path:"/login",element:<Login/>},
        {path:"/billqna",element:<Bill/>},
        {path:"/history",element:<History/>},
        {path:"/about",element:<About></About>}
    ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={mainRoutes}/>
)
