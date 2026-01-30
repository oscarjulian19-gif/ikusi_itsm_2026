import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AIAssistant from './AIAssistant';

const Layout = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <main className="page-content">
                    <Outlet />
                </main>
                <AIAssistant />
            </div>
        </div>
    );
};

export default Layout;
