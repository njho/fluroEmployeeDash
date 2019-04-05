import React, { Component } from 'react';
import './App.scss';
import Root from './Root';
import 'antd/dist/antd.css';
import Firebase, { FirebaseContext } from './Firebase';

class App extends Component {
  render() {
    return (
      <FirebaseContext.Provider value={new Firebase()}>
        <Root />
      </FirebaseContext.Provider>
    );
  }
}

export default App;
