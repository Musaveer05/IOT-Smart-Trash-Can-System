import React from 'react'
import { NavLink } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <>
            <div className="notFound">

                <div className="notFound-404">

                    <h1>404</h1>
                    <h4>Page Not Found</h4>
                    <NavLink to={"/"} >Move Back to Home Page</NavLink>
                </div>

            </div>

        </>
    )
}

export default ErrorPage