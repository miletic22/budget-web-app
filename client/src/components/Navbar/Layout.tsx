import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Header from "./Header"
import './Layout.css'

export default function Layout() {
    return (
        <div className="site-wrapper">
            <Navbar />
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}