import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { renderToString } from 'react-dom/server';


class Cropper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //imgWidth: 0,
            crop: {
                x: 20,
                y: 10,
                width: 30,
                height: 10
            },
            croppedAreaPixels: null,
            croppedImage: null,
            canvasWidth: 800,
            canvasHeight: 400,
            cropOptionsStyle: {
                display: 'inline-block',
                fontSize: '16pt',
                margin: '5px'
            }
        };

    }



    onComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ croppedAreaPixels });
    }


    performCrop = () =>
    {
        let _this = this;
        let croppedAreaPixels = this.state.croppedAreaPixels;
        const canvas = this.refs.canvas;

        this.state.canvasWidth = croppedAreaPixels.width;
        this.state.canvasHeight = croppedAreaPixels.height;
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        const context = canvas.getContext("2d");
        var image = new Image();
        image.onload = function () {
            context.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);
            _this.props.completeCrop(canvas.toDataURL());
        };
        image.src = this.props.imgData;
    }


    cancelCrop = () => {
        this.props.toggleCropper(false);
        this.props.enableTools();
    }



    onCropChange = crop => {
        this.setState({ crop });
    }

    render()
    {
        return (
            <div>
                <div>
                    <button type="button" id="cropSubmit" style={this.state.cropOptionsStyle} ref="cropSubmit" onClick={this.performCrop} > &#10004; </button>
                    <button type="button" id="cropCancel" style={this.state.cropOptionsStyle} ref="cropCancel" onClick={this.cancelCrop} > &#x2716; </button>
                </div>
                <ReactCrop
                    src={this.props.imgData}
                    crop={this.state.crop}
                    onChange={this.onCropChange}
                    onComplete={this.onComplete}
                />
                <canvas ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight} style={{display: 'none'}}> </canvas>
            </div>
        );
    }

}
export default Cropper;