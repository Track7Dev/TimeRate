import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button, AsyncStorage, TextInput } from 'react-native';
import {
  TimerWindow
} from './components';
const Logo = require('./assets/icon.png');

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      timers: [],
      saved: [],
      inputs:{
        open: false,
        title: null,
        rate: null,
        client: null
      }
    }
  }
  addTimer(title, rate, client, key){
    const timers = this.state.timers.concat();
    timers.push(<TimerWindow rate={rate} title={title} client={client}/>);
    this.setState({timers});
    this.setInput('open');
  }
  getTimers(){
    AsyncStorage.getItem('timers')
    .then((timers) => {
      if(!timers || !timers.length) return;
      if(timers !== this.state.saved) this.setState({saved: timers});
      let timersStored = JSON.parse(timers);
      timersStored = timersStored.map((timer) => <TimerWindow saved={true} {...timer} />);
      this.setState({timers: this.state.timers.concat(timersStored)}); 
    })
  }
  clearTimers(){
    AsyncStorage.clear();
  }
  componentWillMount(){
    this.getTimers();
    //this.clearTimers();
  }
  componentWillUpdate(){
    AsyncStorage.getItem('timers')
    .then((timers) => {
      if(timers !== this.state.saved) console.log('same');
    })
  }
  setInput(type, val){
    //if(type === 'rate') val = val.split('$')[0].split('/hr').join('');
    if(type === 'open') {
      const inputs = Object.assign(this.state.inputs, {open: !this.state.inputs.open, title: null, rate: null, client: null});
      return this.setState({inputs});
    }
    const inputsUpdated = Object.assign({},this.state.inputs);
    inputsUpdated[type] = val;
    this.setState({inputs: inputsUpdated});
  }
  render() {
    return (
      <View style={main.container}>
        <View style={main.header}>
          <Image source={Logo} style={{height: 70, width: 70, margin: '1%', borderRadius: 20}}/>
          <Text style={{color: 'white', fontSize: 40,fontWeight: "700"}}>TimeRate Timers {this.state.timers.length}</Text>
        </View>
        <View style={main.content}>
          <ScrollView 
            style={{borderRightWidth: 2, borderRightColor: 'black', width: '30%'}}
          > 
            {
              <View 
                style={{
                  backgroundColor: 'purple', 
                  width: '100%',
                }}
              >
                <View>
                  <Text style={{color: 'white', padding: '2%'}}>Saved: {this.state.saved.length}</Text>
                </View>
              </View>
            }
            {
            this.state.inputs.open ?
              <View
                style={{
                  backgroundColor: "white",
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: "space-around", alignContent: 'center'
                }}
              >
                <View style={{width: '100%', display: 'flex', alignItems: 'center', paddingVertical: '5%', backgroundColor: 'rgba(0,0,0,0.2)'}}><Text>Create A New Timer</Text></View>
                <TextInput autoFocus={this.state.inputs.open} onChangeText={(e) => this.setInput('title', e)} style={{marginVertical: "2%", fontSize: 20, width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center'}} value={this.state.inputs.title || null} placeholder="Title"/>
                <TextInput autoFocus={this.state.inputs.open} onChangeText={(e) => this.setInput('client', e)} style={{marginVertical: "2%", fontSize: 20, width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center'}} value={this.state.inputs.client || null} placeholder="Client"/>
                <View style={{display:'flex', flexDirection: 'row', justifyContent: 'center'}}> 
                  <Text style={{fontSize: 30}}>$</Text><TextInput style={{fontSize: 30}} onChangeText={(e) => this.setInput('rate', e)}placeholder={'0'} value={this.state.inputs.rate || null}/><Text>/Hr</Text>
                </View> 
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'center',
                  paddingVertical: '2%'
                }}>
                  <Button onPress={() => this.setInput('open', !this.state.inputs.open)} title="CANCEL" />
                  {
                    this.state.inputs.title &&
                    this.state.inputs.rate > 0 &&
                    this.state.inputs.client ?
                      <Button 
                        title="ADD"
                        onPress={() => this.addTimer(this.state.inputs.title, this.state.inputs.rate, this.state.inputs.client, this.state.timers.length)}
                      />
                    :
                      null
                  }
                </View>
              </View>
            :
              null
            }
            {this.state.timers.map((timer, i) => React.cloneElement(timer, {key: i, index: i})).reverse()}
            
           

            <Text style={{fontSize: 70, backgroundColor: 'pink', textAlign: 'center'}} onPress={() => this.setInput('open', !this.state.inputs.open)}>+</Text>
          </ScrollView>
          <View style={{backgroundColor: 'teal', display: 'flex',  width: '70%', height: '100%'}}>
            
          </View>      
        </View>
      </View>
    );
  }
}

const main = StyleSheet.create(require('./styles').main);
