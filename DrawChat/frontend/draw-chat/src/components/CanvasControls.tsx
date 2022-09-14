import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import * as fa from "react-icons/fa";

type CanvasControlProps = {
    //Callbacks
    clearCanvasCallback: any,
    undoCanvasCallback: any,
    redoCanvasCallback: any,
    canvasToolCallback: any,
    submitCanvasCallback: any
};

class CanvasControls extends React.Component<CanvasControlProps, {}> {
  constructor(props: any) {
    super(props);
  }

  forwardDrawMode = () => { this.props.canvasToolCallback(true); }
  forwardEraseMode = () => { this.props.canvasToolCallback(false); }

  render() {
    return (
      <div id="canvas-controls">
        <Button
          id="clear-button"
          className="left-button"
          onClick={ this.props.clearCanvasCallback }
        >
          <fa.FaEraser /> Clear
        </Button>
        <Button
          id="undo-button"
          className="left-button"
          onClick={ this.props.undoCanvasCallback }
        >
          <fa.FaUndo /> Undo
        </Button>
        <Button
          id="redo-button"
          className="left-button"
          onClick={ this.props.redoCanvasCallback }
        >
          <fa.FaRedo /> Redo
        </Button>
        <ButtonGroup id="tool-section" className="left-button">
            <Button className="button-spaced" onClick={ this.forwardDrawMode }><fa.FaPencilAlt /></Button>
            <Button className="button-spaced" onClick={ this.forwardEraseMode }><fa.FaEraser /></Button>
        </ButtonGroup>
        <Button
          id="submit-button"
          className="left-button"
          onClick={ this.props.submitCanvasCallback }
        >
          <fa.FaPrint /> Done
        </Button>
      </div>
    );
  }
}

export default CanvasControls;