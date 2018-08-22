import React, { Component } from 'react';
import canvasToImage from 'canvas-to-image';
import AvatarEditor from 'react-avatar-editor';
import Cropper from './Cropper';
import { renderToStaticMarkup } from 'react-dom/server';
import RotateSlider from './RotateSlider';
import '../styles/ImageEditor.css';
import Button from '@govuk-react/button';
import Label from '@govuk-react/label-text';
class ImageEditor extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            editorWidth: 800,
            editorHeight: 400,
            isEditorSizeChanged: true,
            originalImg: {
                imgData: "",
                height: 800,
                width: 400
            },
            imgData: "",
            isToolsDisabled: true,
            rotateValue: 0,
            scaleFactor: 1,
            mainCanvasVisibleStyle: {
                display: 'inline-block'
            },
            selectorVisibleStyle: {
                display: 'none'
            },
            imageEditorWrapperStyle: {
                margin: '0 auto',
                width: '800px'
            },
            imgCropData: "",
            cropSubmitBtn: ""
        }
        this.loadFile = this.loadFile.bind(this);
    }

    resetEditor = () =>
    {
        let originalImg = this.state.originalImg;
        this.setState({
            imgData: originalImg.imgData,
            editorWidth: originalImg.width,
            editorHeight: originalImg.height,
            scaleFactor: 1,
            rotateValue:0,
            isEditorSizeChanged: true,
            imageEditorWrapperStyle: {
                width: originalImg.width,
                margin: '0 auto'
            }
        });
    }

    componentDidMount(){
        let cropSubmitBtn = this.refs.cropSubmit;
        this.setState({cropSubmitBtn: cropSubmitBtn});
    }


    resizeImage = (sign) =>
    {
        let size = sign == 1 ? 1.2 : 0.8;
        let width = this.state.editorWidth * size;
        let height = this.state.editorHeight * size;
        this.setState({
            editorWidth: width,
            editorHeight: height
        });
    }
    setRotateFromTxt(){
        let value = this.refs.rotationTxt.value;
        this.setState({rotateValue: value});
    }

    setRotateValue = (value) => {
        this.setState({
            rotateValue : value
        });

        let width = this.state.editorWidth * 1.2;
        let height = this.state.editorHeight * 1.2;
        let largerSize = width > height? width : height;

        if(this.state.isEditorSizeChanged)
        {
            this.setState({
                editorWidth: largerSize,
                editorHeight: largerSize,
                scaleFactor: 0.5,
                isEditorSizeChanged: false
            });
        }
    }


    loadFile()
    {
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        const _this = this;
        reader.onloadend = function () {
            _this.resetEditor();
            let image = new Image();
            image.onload = function() {
                _this.setState({
                    editorWidth: image.width,
                    editorHeight: image.height,
                    originalImg: {
                        imgData: reader.result,
                        width: image.width,
                        height: image.height
                    },
                    imageEditorWrapperStyle: {
                        width: image.width,
                        margin: '0 auto'
                    }
                });
            };
            image.src = reader.result;
            _this.setState({
                imgData: reader.result,
                isToolsDisabled: false});
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    }


    toggleCropper(isToggled)
    {
        if (isToggled) {
            this.setState({
                selectorVisibleStyle: { display: 'inline-block' },
                mainCanvasVisibleStyle: { display: 'none' }
            });
        }
        else {
            this.setState({
                selectorVisibleStyle: { display: 'none' },
                mainCanvasVisibleStyle: { display: 'inline-block' }
            });
        }
    }

    cropImg = () => {
        if (this.editor) {
            const canvas = this.editor.getImageScaledToCanvas();
            this.setState({ imgCropData: canvas.toDataURL() });
            this.toggleCropper(true);
        }
    }

    completeCrop(croppedImg)
    {
        let _this = this;
        let image = new Image();
        image.onload = function () {
            _this.setState({
                editorWidth: image.width,
                editorHeight: image.height,
                isEditorSizeChanged: true ,
                imageEditorWrapperStyle:
                    {
                        width: image.width,
                        margin: '0 auto'
                    }
            });
        };
        image.src = croppedImg;
        this.setState({
            imgData: croppedImg,
            scaleFactor: 1 }
        );
        this.toggleCropper(false);
    }



    downloadImg = () =>
    {
        if (this.editor) {
            const editorCanvas = this.editor.getImageScaledToCanvas()
            let canvasForDownload = this.refs.canvasForDownload;
            let context = canvasForDownload.getContext("2d");
            let _this = this;
            let finalImage = new Image();
            finalImage.onload = function () {
                _this.setState({
                    editorWidth: finalImage.width,
                    editorHeight: finalImage.height
                });
                context.clearRect(0, 0, canvasForDownload.width, canvasForDownload.height);
                context.drawImage(finalImage, 0, 0, finalImage.width, finalImage.height, 0, 0, finalImage.width, finalImage.height);
                canvasToImage('canvasForDownload',  {
                    name:  'Image',
                    type:  'jpg',
                    quality:  1
                });
            };
            finalImage.src = editorCanvas.toDataURL();
        }
    }


    setEditorRef = (editor) => this.editor = editor
    render()
    {
        return (
            <div className="imageEditorContainer" ref="imageEditorContainer" style = {{width: "100%"}}>
                <div className="imageEditor">
                    <div style={this.state.imageEditorWrapperStyle}>
                        <AvatarEditor
                            className="canvas"
                            style={this.state.mainCanvasVisibleStyle}
                            ref={this.setEditorRef}
                            image={this.state.imgData}
                            width={this.state.editorWidth}
                            height={this.state.editorHeight}
                            border={0}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={this.state.scaleFactor}
                            rotate={this.state.rotateValue}
                        />
                    </div>
                    <div id="canvasForDownloadDiv" style={{display: 'none'}}>
                        <canvas width={this.state.editorWidth + 20} height={this.state.editorHeight + 20} ref="canvasForDownload" id="canvasForDownload"></canvas>
                    </div>

                    <div className="imageEditor" style={this.state.selectorVisibleStyle}>
                        <div style={this.state.imageEditorWrapperStyle}>
                            <div className="canvas">
                                <Cropper imgData={this.state.imgCropData} completeCrop={(croppedImg) => { this.completeCrop(croppedImg) }} cropSubmitBtn={this.state.cropSubmitBtn} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="editorOptions">
                    <div className="imageOption">
                        <Label htmlFor="fileBrowser"> Upload Image </Label> <br/>
                        <input type="file" ref="fileBrowser" id="fileBrowser" onChange={this.loadFile} style={{display: 'inline-block'}}/>
                    </div>

                    <div className="imageOption">
                        <Label htmlFor="crop"> Crop </Label> <br/>
                        <Button type="button" id="crop" style={{ display: 'inline-block' }} disabled={this.state.isToolsDisabled} onClick={this.cropImg} > Crop </Button>

                    </div>

                    <div className="imageOption">
                        <Label htmlFor="rotateTxt"> Rotate </Label> <br/>
                        <input type="number" id="rotateTxt" ref="rotationTxt" disabled={this.state.isToolsDisabled}/>
                        <Button type="button" onClick={(degrees) => { this.setRotateFromTxt() }} style={{ display: 'inline-block' }}  disabled={this.state.isToolsDisabled}> Rotate </Button>
                    </div>
                    <RotateSlider setValue={this.setRotateValue} text={"Rotate Image"} display={this.state.isToolsDisabled}/>

                    <div className="imageOption">
                        <Label htmlFor="resize"> Resize </Label> <br/>
                        <button type="button" id="resize" onClick={() => this.resizeImage(-1)} style={{ display: 'inline-block' }}  disabled={this.state.isToolsDisabled}> - </button>
                        <button type="button" onClick={() => this.resizeImage(1)} style={{ display: 'inline-block' }}  disabled={this.state.isToolsDisabled}> + </button>
                    </div>

                    <div className="imageOption">
                        <Label htmlFor="download"> Download Image </Label> <br/>
                        <a id="download" ref="downloadBtn" onClick={this.downloadImg}>  <Button disabled={this.state.isToolsDisabled}> Download Image </Button> </a>
                    </div>

                    <div className="imageOption">
                        <Button type="reset"  onClick={this.resetEditor} disabled={this.state.isToolsDisabled}>Reset</Button>
                    </div>

                </div>
            </div>
        );
    }

}
export default ImageEditor;