import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Slide from './Slide';

class Slider extends React.Component {
  constructor(){
    super()
    this.state = { cur: 0 }
  }
  componentDidMount() {
    this.interval = setInterval(()=> {
      const { pins } = this.props;
      let { cur } = this.state;
      if (pins.length === 0) {
        return
      }
      cur = (cur + 1) % pins.length
      this.setState({cur})
    }, 5000)
  }
  componentWillUnmount() {
    if (this.interval){
      clearInterval(this.interval);
    }
  }
  onStartClick() {
    const { dispatch, pins } = this.props;
    if (pins.length === 0) {
      dispatch({type: "FEED_LOAD_REQUESTED"})
    }
  }
  render() {
    const { cur } = this.state;
    const { pins, fetchErr } = this.props;
    if  (pins.length === 0) {
      return (<div className="center-center">
        { fetchErr && <p className="error"> {fetchErr} </p> }
        <button onClick={this.onStartClick.bind(this)}> start slideshow! </button>
      </div>)
    }
    return (<ReactCSSTransitionGroup
              transitionName="slide"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
        <Slide key={cur} pin={pins[cur]} cutLen="80"/>
      </ReactCSSTransitionGroup>);
  }
}
export default Slider;
