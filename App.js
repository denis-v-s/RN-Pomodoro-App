import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import TimeSettingComponent from './TimeSettingComponent.js'
import {vibrate} from './utils'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      activeTimerType: null,
      runtime: 0,
      busyTime: 25,
      breakTime: 5,
      message: ''
    }
    
    this.buttonText = 'start pomodoro'
    this.pomodoroActive = false
    this.buttonStyle = 'blue'
    this.prevTimerType = null
  }

  // make changes to UI and start the timer
  startPomodoro() {
    this.setState({
      runtime: this.state.busyTime * 60,
      activeTimerType: timerType.busyTimer,
      message: 'wow, so much busy! Great work, keep on going!'
    })
    // set update to 1s interval
    this.interval = setInterval(this.incrementTimer, 1000)
    this.pomodoroActive = true
  }

  // terminate the timer and change the UI
  stopPomodoro() {
    clearInterval(this.interval)
    this.buttonText = 'start pomodoro'
    this.buttonStyle = 'blue'
    this.pomodoroActive = false
    this.setState({ 
      runtime: 0,
      message: ''
    })
  }

  // pomodoro on a break
  setPomodoroBreakState() {
    this.buttonText = 'cancel breaktime'
    this.buttonStyle = 'red'
    this.setState({
      runtime: this.state.breakTime * 60,
      activeTimerType: timerType.breakTimer,
      message: 'taking a break, are we!?'
    })
  }

  // pomodoro as busy
  setPomodoroBusyState() {
    this.buttonText = 'take a break'
    this.buttonStyle = 'green'
    this.setState({
      runtime: this.state.busyTime * 60,
      activeTimerType: timerType.busyTimer,
      message: 'Great work, keep on going! Busy busy busy...'
    })
  }

  togglePomodoroPause() {
    // resume timer, if pomodoro was paused
    if (this.state.activeTimerType === timerType.paused) {
      this.interval = setInterval(this.incrementTimer, 1000)
      this.setState({
        activeTimerType: this.prevTimerType,
      }, function() {
        if (this.state.activeTimerType === timerType.busyTimer) {
          this.setState({message: 'Busy busy busy! Keep on going!'})
        } else if (this.state.activeTimerType === timerType.breakTimer) {
          this.setState({message: 'A break after a break? Much smart, wow!'})
        }
      })

    // set pomodoro pause if the timer is active
    } else {
      clearInterval(this.interval)
      this.prevTimerType = this.state.activeTimerType
      this.setState({
        activeTimerType: timerType.paused,
        message: 'Freeze!'
      })
    }
  }

  // switches between break, active, and vice-versa
  switchPomodoroState() {
    if (this.pomodoroActive) {
      if (this.state.activeTimerType == timerType.busyTimer) {
        this.setPomodoroBreakState()
      } else {
        this.setPomodoroBusyState()
      }
      // let the user know that the timer has ran out
      vibrate()
    } else {
      this.startPomodoro()
      this.setPomodoroBusyState()
    }
  }

  // handle timer incrementing within the app state
  incrementTimer = () => {
    // check if the time ran out, and switch pomodoro state    
    if (this.state.runtime == 0) {
      this.switchPomodoroState()
    }
    
    this.setState(prevState => ({
      runtime: prevState.runtime - 1
    }))
  }

  // will be passed to TimeSettingComponenet in order to lift the state up
  handleBusyTimeChange = (minutes) => {
    this.setState({ busyTime: minutes })
  }
  
  // will be passed to TimeSettingComponenet in order to lift the state up
  handleBreakTimeChange = (minutes) => {
    this.setState({ breakTime: minutes })
  }

  render() {
    // elapsed minutes
    let m = (this.pomodoroActive) ? Math.floor(this.state.runtime / 60) : this.state.busyTime
    // elapsed seconds
    let s = (this.state.runtime % 60)

    return (
      <View style={styles.container}>
        <Text style={{margin: 20}}>
          {this.state.message}
        </Text>

        <TimeSettingComponent 
          text='keep BUSY for' 
          minutes={this.state.busyTime} 
          onSettingsChange={this.handleBusyTimeChange} 
          restrictControlInteraction={this.pomodoroActive} />

        <TimeSettingComponent 
          text='then take a BREAK for' 
          minutes={this.state.breakTime} 
          onSettingsChange={this.handleBreakTimeChange} 
          restrictControlInteraction={this.pomodoroActive} />

        { 
          this.state.activeTimerType != timerType.paused && 
          <Button color={this.buttonStyle} title={this.buttonText} onPress={() => this.switchPomodoroState()} />
        }

        <Text style={styles.timer}>
          {('00' + m).slice(-2) + ':' + ('00' + s).slice(-2)}
        </Text>
        
        {
          this.pomodoroActive && this.state.activeTimerType != timerType.paused &&
          <View style={{flexDirection: 'row'}}>
            <View style={{marginHorizontal: 5}}>
              <Button title='pause' onPress={() => this.togglePomodoroPause()} />
            </View>
            <View style={{marginHorizontal: 5}}>
              <Button color='grey' title='cancel session' onPress={() => this.stopPomodoro()} />
            </View>
          </View>

        }
        {
          this.pomodoroActive && this.state.activeTimerType == timerType.paused &&
          <Button title='resume pomodoro' onPress={() => this.togglePomodoroPause()} />
        }

        {/* <TimerComponent seconds={this.state.runtime} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 62
  },
});

var timerType = {
  busyTimer: 1,
  breakTimer: 2,
  paused: 3
}