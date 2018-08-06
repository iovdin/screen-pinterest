import React from 'react';
import { connect } from 'react-redux'
import Auth from '../components/Auth'
import Slider from '../components/Slider'

const AuthVisible = connect(
  state => ({ authError: state.auth.error }, 
  dispatch => ({ dispatch: dispatch }))
)(Auth);

const SliderVisible = connect(state => ({ 
  pins: state.slides.pins,
  fetchErr: state.slides.err,
}))(Slider)

const App = ({isAuthenticated}) => isAuthenticated ? <SliderVisible/> : <AuthVisible/> 

export default connect(state => ({ isAuthenticated: state.auth.isAuthenticated}))(App);
