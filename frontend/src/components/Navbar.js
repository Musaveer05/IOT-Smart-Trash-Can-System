import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { UserContext } from '../App'

const Navbar = () => {

    const {state} = useContext(UserContext)

    const NavRender = () => {

        if (state === true) {
            return (
                <>

                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/AboutUs">About <span className="sr-only">(current)</span></NavLink>
                    </li>

                </>
            )
        }
        else {
            return (
                <>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/Register">Register</NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/Login">Login</NavLink>
                    </li>
                </>
            )
        }

    }

    return (
        <>

            <nav className="navbar navbar-expand-lg navbar-light">
                <NavLink className="navbar-brand" to="#">Navbar</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <NavRender/>
                    </ul>
                </div>
            </nav>

        </>
    )
}

export default Navbar