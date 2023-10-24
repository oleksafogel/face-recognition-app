import React from "react";

const Navigation = ({ onRouteChange, isSignedIn, isOnRegisterPage }) => {
    if (isSignedIn) {
        return (
            <nav style={{display: 'flex'}}>
                <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('signin')}>Sign Out</p>
            </nav>
        )
    } else if (isOnRegisterPage) {
        return (
            <nav style={{display: 'flex'}}>
                <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('signin')}>Sign In</p>
            </nav>
        )
    } else {
        return (
            <nav style={{ display: 'flex'}}>
                <p className="f3 link dim black underline pa3 pointer" onClick={() => onRouteChange('register')}>Register</p>
            </nav>
        )
    }
    
}

export default Navigation;