import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Selector from './Selector';
import Slider from 'react-rangeslider';
import canvasToImage from 'canvas-to-image';
import AvatarEditor from 'react-avatar-editor';

import 'react-rangeslider/lib/index.css';
import '../styles/ImageEditor.css';

class ImageEditor extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      selection: {},
      imgData: "",      
      mainCanvasVisibleStyle: {
        display: 'inline-block'
      },
      selectorVisibleStyle: {
        display: 'none'
      },
      isSelectDisabled: true,
      isToolsDisabled: true,
      rotateSliderValue: 0
    }
  }
    
  
  getCanvasMidPoint()
  {
    const canvas = this.refs.resultCanvas;
    let xPoint = canvas.width /2 - this.state.selection.width / 2;
    let yPoint = canvas.height /2 - this.state.selection.height / 2;
    return {
      x: xPoint,
      y: yPoint
    };
  }
  
  
  loadCanvas(imgData){
    let canvas =  this.refs.resultCanvas;
    const context = canvas.getContext("2d"); 
    let _this = this;
    
    var image = new Image();
    image.onload = function() {  
      context.clearRect(0, 0, canvas.width, canvas.height); 
      let imgSize = {
        width: image.width,
        height: image.height
      };
      _this.setState({selection: imgSize}); 
      context.save();
      context.translate(_this.getCanvasMidPoint().x, _this.getCanvasMidPoint().y);      
      context.drawImage(image, 0, 0);
      context.restore();
      _this.setState({imgData: canvas.toDataURL('image/jpeg')});
      _this.setState({isSelectDisabled: false});
    };
    image.src =  this.state.imgData;
  }
  
  
  setSelection(pixels){
    this.setState({selection: pixels});
    this.setState({isSelectDisabled: true});
    this.setState({isToolsDisabled: false});
  }
  
  
  cropImg()
  {
    let selection = this.state.selection;
    let _this = this;
    const canvas = this.refs.resultCanvas;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); 
    
    var image = new Image();
    image.onload = function() {      
      context.save();
      let midPoint = _this.getCanvasMidPoint(); 
      context.translate(midPoint.x, midPoint.y);
      context.drawImage(image, selection.x, selection.y, selection.width, selection.height, 0, 0, selection.width, selection.height);  
      context.restore();
      _this.setState({imgData: canvas.toDataURL('image/jpeg')});
      _this.toggleSelector(false);
      _this.setState({isSelectDisabled: false});
      _this.setState({isToolsDisabled: true});
    };
    image.src =  this.state.imgData;   
  }
  
  
  loadFile()
  {
     var file = document.querySelector('input[type=file]').files[0];
     var reader = new FileReader();
     var _this = this;

     reader.onloadend = function () {
       _this.setState({imgData: reader.result});
       _this.loadCanvas(reader.result);           
     }

     if (file) {
       reader.readAsDataURL(file); 
     }   
  }
  
  toggleSelector(isToggled)
  {
    if(isToggled){
      this.setState({ selectorVisibleStyle: {display: 'inline-block'}});
      this.setState({ mainCanvasVisibleStyle: { display: 'none' } });
    }
    else{
      this.setState({ selectorVisibleStyle: { display: 'none' } });
      this.setState({ mainCanvasVisibleStyle: { display: 'inline-block' } });
    }
  }


  rotate()
  {
    let value = this.state.rotateSliderValue; console.log(value);
    let selection = this.state.selection;
    const canvas = this.refs.resultCanvas;
    const context = canvas.getContext("2d");
    let _this = this;

    var image = new Image();
    image.onload = function () {      
      context.clearRect(0, 0, canvas.width, canvas.height); 
      context.save();      
      let midPoint = _this.getCanvasMidPoint();  
      context.translate(midPoint.x, midPoint.y);
      context.rotate(value * Math.PI / 180); 
      context.drawImage(image, selection.x, selection.y, selection.width, selection.height, 0, 0, selection.width, selection.height);      
      context.restore();
      _this.setState({ imgData: canvas.toDataURL('image/jpeg') });
      _this.toggleSelector(false);
      _this.setState({isSelectDisabled: false});
      _this.setState({isToolsDisabled: true});
    };
    image.src = this.state.imgData;
  }


  resize(percentage)
  {
    let selection = this.state.selection;
    const canvas = this.refs.resultCanvas;    
    const context = canvas.getContext("2d");
    let _this = this;

    var image = new Image();
    image.onload = function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(percentage, percentage);
      context.drawImage(image, selection.x, selection.y, selection.width, selection.height, 0, 0, selection.width, selection.height); 
      context.restore();
      _this.setState({ imgData: canvas.toDataURL('image/jpeg') });
      _this.toggleSelector(false);
      _this.setState({isSelectDisabled: false});
      _this.setState({isToolsDisabled: true});
    };
    image.src = this.state.imgData;
  }

 
  handleRotateSliderOnChange = (value) => {
    let degrees = this.state.rotateSliderValue + parseFloat(3.6);
    this.setState({
      rotateSliderValue: degrees
    });
    this.rotate();
  }
  
  handleRotateSlider = () => {
    console.log("handleRotateSlider");
    console.log(this.state.rotateSliderValue);
  }
  
  
  onDegreeChange(){
    this.setState({
      rotateSliderValue: this.refs.rotationTxt.value
    });    
  }
  
  
  downloadImg()
  {   
    canvasToImage('resultCanvas', {
      name: 'Image',
      type: 'jpg',
      quality: 1
    });
  }



  render(){
    return (
      <div class="imageEditor">        
        <canvas className="canvas" id="resultCanvas" ref="resultCanvas" style={this.state.mainCanvasVisibleStyle} width="1600" height="800"/>
        <div className="canvas" style={this.state.selectorVisibleStyle}>
          <Selector imgData={this.state.imgData} imgSrc={this.state.imgSrc} img={this.state.canvas} setSelection={(pixels) => {this.setSelection(pixels)}} toggleSelector={(toggle) => {this.toggleSelector(toggle)}}/>
        </div>
        
        <div className="editorOptions">
          <div className="imageOption">
            <label htmlFor="fileBrowser"> Upload Image </label> <br/>
            <input type="file" id="fileBrowser" onChange={this.loadFile.bind(this)} style={{display: 'inline-block'}}/>
          </div>

          <div className="imageOption">
            <label htmlFor="makeSelection"> Make Selection </label> <br/>
            <button type="button" id="makeSelection" onClick={(toggle) => {this.toggleSelector(true)}} style={{display: 'inline-block'}} disabled={this.state.isSelectDisabled}>Select </button> 
          </div>
          
          <div className="imageOption">
            <label htmlFor="crop"> Crop </label> <br/>
            <button type="button" id="crop" onClick={() => {this.cropImg()}} style={{display: 'inline-block'}}  disabled={this.state.isToolsDisabled}> Crop </button>
          </div>
          
          <div className="imageOption">
            <label htmlFor="rotateTxt"> Rotate </label> <br/>
            <input type="number" id="rotateTxt" ref="rotationTxt" onChange={this.onDegreeChange.bind(this)}  disabled={this.state.isToolsDisabled}/>
            <button type="button" onClick={(degrees) => { this.rotate(20) }} style={{ display: 'inline-block' }}  disabled={this.state.isToolsDisabled}> Rotate </button>
          </div>
          
          
          <div className="imageOption">
            <label htmlFor="resize"> Resize </label> <br/>
            <button type="button" id="resize" onClick={(percentage) => { this.resize(0.5) }} style={{ display: 'inline-block' }}  disabled={this.state.isToolsDisabled}> - </button>
            <button type="button" onClick={(percentage) => { this.resize(1.5) }} style={{ display: 'inline-block' }}  disabled={this.state.isToolsDisabled}> + </button>
          </div>
          
          <div className="imageOption">
            <label htmlFor="download"> Download Image </label> <br/>
            <a id="download" ref="downloadBtn" onClick={this.downloadImg}>  <button disabled={this.state.isSelectDisabled}> Download Image </button> </a>
          </div>
        </div>

        
        
        <div className="slider" style={{width: '500px'}}>
          <h3 htmlFor="rotateSlider"> Rotate Angle </h3>
          <Slider
            min={-180}
            max={180}
            tooltip={false}
            value={this.state.rotateSliderValue}
            onChange={this.handleRotateSliderOnChange}
            onChangeComplete={this.handleRotateSlider}
          />
          <div className='value'>{this.state.rotateSliderValue}</div>
        </div>      
        
        
        
      </div>
    );
  }  

}
export default ImageEditor;