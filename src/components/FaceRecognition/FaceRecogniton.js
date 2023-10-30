import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ imgUrl, box, celebName }) => {
    console.log(celebName);
    return (
        <div>
            <div className="celeb-name center ma4 b f2 ttc">Your Star Name: {celebName}</div>
            <div className="center ma">
                <div className="absolute mt2">
                    <img id="input-image" src={imgUrl} alt='' width="500px" height="auto" />
                    <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                </div>
            </div>
        </div>
    )
}

export default FaceRecognition;