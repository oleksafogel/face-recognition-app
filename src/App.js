import React, { Component } from 'react';

import './App.css';

import MouseParticles from 'react-mouse-particles'

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecogniton';
import SignIn from './components/Signin/SignIn';
import Register from './components/Register/Register';

const initialState = {
  userInput: '',
  imgUrl: '',
  celebName: '',
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

  identifyCelebName = (data) => {
    const celebName = data.outputs[0].data.regions[0].data.concepts[0].name;
    return celebName;
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  displayCelebName = (celebName) => {
    this.setState({celebName});
  }

  onUserInputChange = (e) => {
    this.setState({ userInput: e.target.value });
  }

  onPictureSubmit = (e) => {
    this.setState({imgUrl: this.state.userInput});
    fetch('https://wonder-star-app-backend.onrender.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.userInput
      })
    })
    .then(response => response.json())
    .then(response => {
      this.displayFaceBox(this.calculateFaceLocation(response));
      this.displayCelebName(this.identifyCelebName(response));
      if (response) {
        fetch('https://wonder-star-app-backend.onrender.com/image', {
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
    const { isOnRegisterPage, isSignedIn, route, box, imgUrl, user, celebName } = this.state;
    return (
      <div className="App">
        <MouseParticles g={1} color="random" radius={5} />
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px', alignItems: 'center'}}>
          <Logo />
          <Navigation isOnRegisterPage={isOnRegisterPage} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        </div>
        { route === 'home'
          ? <div>
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm onUserInputChange={this.onUserInputChange} onButtonClick={this.onPictureSubmit} />
              <FaceRecognition imgUrl={imgUrl} box={box} celebName={celebName} />
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
