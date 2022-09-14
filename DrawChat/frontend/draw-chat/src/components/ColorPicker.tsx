/*
 * @author Sam Basile
 * React Color Picker for the brush color
 *
 */
import React from 'react';
import { CirclePicker } from 'react-color';

/* 
 *  Passed in from App.tsx
 *   
 */
type ColorPickerProps = {
    colorChangeCallback: any //Callback to parent to change state
};

const style = {
    transform: 'rotate(90deg)',
};

class ColorPicker extends React.Component<ColorPickerProps, {}> {
    //Avaliable colors
    private colors: string[] = [
        "#d63636", "#e68e3c", "#e6ce50", "#49a059", "#5c9ddd",
        "#c52e8b", "#633894", "#653716", "#101113"
    ];

    /*private style = {
        transform: 'rotate(90deg)'
    };*/

    constructor(props: any) {
        super(props);
    }

    //Change brush color in parent state
    handleChangeComplete = (color: any) => {
        this.setState({
            background: color.hex
        });
        console.log(color.hex);
        this.props.colorChangeCallback(color.hex);
    };

    render() {
        return (
            <div /*style={style}*/>
            <CirclePicker //from react-color
                width="80%"
                onChangeComplete={ this.handleChangeComplete }
                colors={ this.colors }
             />
             </div>
        );
    }
}

export default ColorPicker;