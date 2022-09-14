/*
 * @author Sam Basile
 * Main React Component that renders all child components
 */
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import ColorPicker from './components/ColorPicker';
import CanvasControls from './components/CanvasControls';
import ChatBox from './components/ChatBox';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Timer from './components/Timer';

/*
 *  Think of these as global variables, they are
 *  passed down to the child components and updates
 *  in here are automatically reflected to children
 */
type AppState = {
    color: string,
    canvasColor: string,
    brushWidth: number,
    chatMessages: string[],
    game_code: string,
    current_word: string,
    total_time: number,
    export_duration: number
};

/*
 * Think of these as global constants
 */
type AppProps = {
  width: string,
  height: string
};

//Default state
const defaultState = {
    color: "black",
    canvasColor: "white",
    brushWidth: 4,
    chatMessages: [],
    game_code: new URLSearchParams(window.location.search).get("game_code") || "000000",
    current_word: new URLSearchParams(window.location.search).get("word") || "*pst* set word in the search params",
    total_time: 30,
    export_duration: 1000
};

class App extends React.Component<AppProps, AppState> {

   canvasRef: React.RefObject<Canvas>;
   chatboxRef: React.RefObject<ChatBox>;
   constructor(props: any) {
      super(props);
      this.state = defaultState;
      this.handleColorChange = this.handleColorChange.bind(this);
      console.log("game_code = " + this.state.game_code);

      this.canvasRef = React.createRef();
      this.chatboxRef = React.createRef();
   }

   /* 
    * Get color from ColorPicker component and send it to
    *  the Canvas component via a callback
    */
   handleColorChange = (color: any) => {
        console.log("new brush color: " + color as string);
        this.setState({
            color: color as string
        });
   }

   handleClearCanvas = () => { this.canvasRef.current?.clearCanvas(); }
   handleUndoCanvas = () => { this.canvasRef.current?.undoLast(); }
   handleRedoCanvas = () => { this.canvasRef.current?.redoLast(); }
   handleToolChange = (draw: boolean) => { this.canvasRef.current?.changeTool(draw); }
   handleSendMessage = (message: string) => { this.setState({ chatMessages: [...this.state.chatMessages, message ] }); }
   handleSubmitCanvas = () => { 
     console.log("handleSubmitCanvas");
     this.canvasRef.current?.exportCanvas();
    }

   render() {
    return (
      <Container fluid>
        <Row className="upper-row">
          <Col lg={2}>The current word is: { this.state.current_word } !</Col>
          <Col id="upper-center-content" xs={12} lg={7}>
            Time to Draw :) 
          </Col>
          <Col lg={1}>Exporting every { this.state.export_duration} ms.</Col>
          <Col lg={1}>{ this.state.game_code }</Col>
          <Col lg={1}>
            <Timer
              total_time={ this.state.total_time }
              submitCanvasCallback={ this.handleSubmitCanvas }
            />
          </Col>
        </Row>
        <Row>
          <Col id="left-content" lg={1}>
            <div id="color-picker" className="color-picker">
              <ColorPicker colorChangeCallback={this.handleColorChange} />
            </div>
            <div>
              <CanvasControls 
                  clearCanvasCallback={ this.handleClearCanvas }
                  undoCanvasCallback={ this.handleUndoCanvas }
                  redoCanvasCallback={ this.handleRedoCanvas }
                  canvasToolCallback={ this.handleToolChange }
                  submitCanvasCallback={ this.handleSubmitCanvas }
              />
            </div>
          </Col>
          <Col id="canvas-content">
            <Canvas
              ref={ this.canvasRef }
              width={this.props.width}
              height={this.props.height}
              color={this.state.color}
              canvasColor={this.state.canvasColor}
              brushWidth={this.state.brushWidth}
              game_code={this.state.game_code}
              export_duration={this.state.export_duration}
            />
          </Col>
        </Row>
      </Container>
    );
   }
}

export default App;
