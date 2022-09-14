/*
 * @author Sam Basile
 * React component for drawing on
 */ 
import React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

/*
 * Passed in from parent, mutable by the parent
 * See "Lifting the State" for React
 */
type CanvasProps = {
    width: string,
    height: string,
    color: string,
    canvasColor: string,
    brushWidth: number,
    game_code: string,
    export_duration: number
};

/*
 *  CSS styles for ReactSketchCanvas
 */
const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
};

class Canvas extends React.Component<CanvasProps, {}> {
    private canvas: React.RefObject<ReactSketchCanvas>;

    constructor(props: any) {
        super(props);
        this.canvas = React.createRef();
        this.scheduledExport();
    }

    componentDidMount() { /* TODO */ }

    componentWillUnmount() {/* TODO */ }

    scheduledExport() {
        setInterval(() => {
            this.exportCanvas();
        }, this.props.export_duration);
    }

    exportCanvas() {
        this.canvas.current?.exportSvg()
        .then((res) => {
            console.log("Sending post. game_code = " + this.props.game_code);
            fetch('/draw/update_image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    game_code: this.props.game_code,
                    svg: Buffer.from(res, 'binary').toString('base64') 
                })
            })
            .then((res) => {
                console.log("POSTed svg!");
            }).catch((err) => {
                console.log("Failed to POST svg. Error: " + JSON.stringify(err));
            });
        }).catch((err) => {
            console.log("Error occured in internal image export. Error: " + JSON.stringify(err));
        });
    }

    clearCanvas() { this.canvas.current?.clearCanvas(); }
    undoLast() { this.canvas.current?.undo(); }
    redoLast() { this.canvas.current?.redo(); }
    changeTool(draw: boolean) { this.canvas.current?.eraseMode(!draw); }

    render() {
        return (
            <ReactSketchCanvas
                  ref={ this.canvas }
                  style={ styles }
                  width={ this.props.width }
                  height={ this.props.height }
                  strokeWidth={ this.props.brushWidth }
                  strokeColor= { this.props.color }
                  canvasColor= { this.props.canvasColor }
              />
        );
    }
}

export default Canvas;