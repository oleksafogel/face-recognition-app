import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecogniton';
import ParticlesBg from 'particles-bg';
import React, { Component } from 'react';

const clarifaiSetUp = (imgUrl) => {
  const PAT = 'c168ca4bd8ac46b0a11775fa41cfbf94';
  const USER_ID = 'ofogel';       
  const APP_ID = 'face-recognition-app';
  const IMAGE_URL = imgUrl;

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: '',
      imgUrl: '',
      box: ''
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFaceBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFaceBox.left_col * width,
      topRow: clarifaiFaceBox.top_row * height,
      rightCol: width - (clarifaiFaceBox.right_col * width),
      bottomRow: height - (clarifaiFaceBox.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onUserInputChange = (e) => {
    this.setState({ userInput: e.target.value });
  }

  onButtonClick = (e) => {
    this.setState({imgUrl: this.state.userInput});
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", clarifaiSetUp(this.state.userInput))
    .then(response => response.json())
    .then(response => {
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(error => console.log('error', error));
  }
  

  render () {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px', alignItems: 'center'}}>
          <Logo />
          <Navigation />
        </div>
        <Rank />
        <ImageLinkForm onUserInputChange={this.onUserInputChange} onButtonClick={this.onButtonClick} />
        <FaceRecognition imgUrl={this.state.imgUrl} box={this.state.box} />
      </div>
    );
  }
}

export default App;
