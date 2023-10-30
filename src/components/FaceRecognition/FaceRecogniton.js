import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ imgUrl, box, celebName }) => {
    console.log(celebName);
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <div className="celeb-name center b f2 pa3 ttc">Your Star Name: {celebName}</div>
                <img id="input-image" src={imgUrl} alt='' width="500px" height="auto" />
                <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;