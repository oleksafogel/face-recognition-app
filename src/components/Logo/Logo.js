import React from "react";
import Tilt from 'react-parallax-tilt';
import logo from './logo.png';


const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt>
                <div style={{ height: '100px', width: '100px' }}>
                    <img src={logo} alt='Logo' />
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;