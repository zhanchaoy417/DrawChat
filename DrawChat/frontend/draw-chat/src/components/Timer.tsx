import React from 'react';
import { CountdownCircleTimer, CountdownCircleTimerProps } from 'react-countdown-circle-timer';

type TimerProps = {
    total_time: number,
    submitCanvasCallback: any
};

type TimerState = {
    current_time: number
    redirect: boolean
};

const defaultState = {
    current_time: 30,
    redirect: false
};

class Timer extends React.Component<TimerProps, TimerState> {
    constructor(props: any) {
        super(props);
        this.state = defaultState;
    }

    onTimerComplete = () => {
        console.log("Timer completed");

        //Upload image for final time
        this.props.submitCanvasCallback();

        //Redirect to game over page
        window.location.href = 'https://draw-chat-csci3308.herokuapp.com/game_over';
    };

    render() {
        return(
            <CountdownCircleTimer
                onComplete={ this.onTimerComplete }
                isPlaying
                duration={ this.props.total_time }
                initialRemainingTime={ this.state.current_time }
                colors="#A30000"
                size={ 50 }
            />
        );
    }
}

export default Timer;