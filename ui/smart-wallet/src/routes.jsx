import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'

function AppRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/landing' element={<Landing />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
