import React, { Component } from 'react';

import './App.css';

import ParticlesBg from 'particles-bg';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecogniton';
import SignIn from './components/Signin/SignIn';
import Register from './components/Register/Register';

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

const initialState = {
  userInput: '',
  imgUrl: '',
  box: '',
  route: 'signin',
  isSignedIn: false,
  isOnRegisterPage: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
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

  onPictureSubmit = (e) => {
    this.setState({imgUrl: this.state.userInput});
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", clarifaiSetUp(this.state.userInput))
    .then(response => response.json())
    .then(response => {
      this.displayFaceBox(this.calculateFaceLocation(response));
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(error => console.log('error', error));
      }
    })
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState);
      this.setState(initialState);
    } else if (route === 'register') {
      this.setState({isOnRegisterPage: true});
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
      this.setState({isOnRegisterPage: false});
    }
    this.setState({route});
  }
  

  render () {
    const { isOnRegisterPage, isSignedIn, route, box, imgUrl, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px', alignItems: 'center'}}>
          <Logo />
          <Navigation isOnRegisterPage={isOnRegisterPage} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        </div>
        { route === 'home'
          ? <div>
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm onUserInputChange={this.onUserInputChange} onButtonClick={this.onPictureSubmit} />
              <FaceRecognition imgUrl={imgUrl} box={box} />
            </div>
          : ( 
            route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
