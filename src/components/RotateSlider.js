import React, {Component} from 'react';
import Label from '@govuk-react/label-text';
import { CircularSlider } from 'circular-slider';


class RotateSlider extends Component {

    constructor(){
        super();
        this.state = {
            angle: 0
        }
    }



    logAngle(angle){
        if(angle => 360){
            angle = angle - 360;
        }
        if(angle <= -360){
            angle = angle + 360;
        }

        this.props.setValue(angle);
        this.setState(
            {angle : angle}
        )
    }





    render() {
        let displayStyle;
        if(this.props.display){
            displayStyle = {display : "none"}
        } else {
            displayStyle={display: "inline-block"}
        }
        return (
            <div className="Slider" >
                <Label className="RotateSliderLabel" >{this.props.text} </Label>
                <br/>
                <div className="CircularSlider" style={displayStyle}>
                <CircularSlider
                    angle={this.state.angle}
                    showArc= {true}
                    r={50}
                    arcStart= {0}
                    arcEnd={360}
                    showNeedle={true}
                    onMove={(angle) => {this.logAngle(angle)}}
                />
                </div>
            </div>
        );
    }
}

export default RotateSlider