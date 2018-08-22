import React, { Component } from 'react';
import ReactDOM from "react-dom";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { renderToString } from 'react-dom/server';


class Selector extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      crop: {
        x: 20,
        y: 10,
        width: 30,
        height: 10
      },
      croppedAreaPixels: null,
      croppedImage: null
    };
  }
  
  
  
  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ croppedAreaPixels});    
    this.props.setSelection(croppedAreaPixels);
  }

  
  
  onCropChange = crop => {
    this.setState({ crop });
  }

  render(){
    return (
     <ReactCrop  
      src={this.props.imgData}
      crop={this.state.crop}
      onChange={this.onCropChange}
      onComplete={this.onCropComplete}
     />
    );
  }  

}
export default Selector;