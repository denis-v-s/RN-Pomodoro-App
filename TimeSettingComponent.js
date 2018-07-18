import React from 'react';
import {StyleSheet, Text, View, TextInput, Slider} from 'react-native';

const styles = StyleSheet.create({
    row: { 
        flexDirection: 'row',
        padding: 10,
        width: 250
    },
    column: {
        flexDirection: 'column'
    },
    slider: {
        flex: 1
    }
})

let mins

export default class TimeSettingComponent extends React.Component {
    state = {
        minutes: this.props.minutes
    }

    handleTimeSettingChange = minutes => {
        this.setState({ minutes })
        this.props.onSettingsChange(minutes)
    }

    render() {
        return (
            <View style={styles.column}>
                <Text>{this.props.text}</Text>
                
                <View style={styles.row}>
                    <Slider 
                        style={styles.slider} 
                        minimumValue={1} 
                        maximumValue={60} 
                        step={1} 
                        value={this.state.minutes} 
                        onValueChange={ this.handleTimeSettingChange }
                        />
                    <Text>{this.state.minutes} minutes</Text>
                </View>
            </View>
        )
    }
}