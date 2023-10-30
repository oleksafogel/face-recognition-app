import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({ onUserInputChange, onButtonClick }) => {
    return (
        <div>
            <p className="f3">
                {'The Wonder Star App will detect celebrities in your pics. Give it a try.'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input className="f4 pa2 w-70 center ba b--near-white" type="text" onChange={onUserInputChange} />
                    <button className="w-30 grow f4 link ph3 pv2 dib white ba b--near-white" onClick={onButtonClick}>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;