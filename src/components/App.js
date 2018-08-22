import React, { Component } from 'react';
import GovUkPage from './GovUKPage';
import { BrowserRouter } from 'react-router-dom';
class App extends Component
{

  render(){
    return(
      <BrowserRouter>
          <GovUkPage />
      </BrowserRouter>
    )
  }

}
export default App;