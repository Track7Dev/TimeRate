import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	Button,
	Dimensions,
	TouchableHighlight,
	AsyncStorage
} from 'react-native';

export default class TimerWindow extends Component {
	constructor(props){
		super(props);
		this.isRunning = false;
		this.state = {
			time: null,
			break: 0,
			paused: 0,
			isRunning: false
		}
		this.init = true;
		this.clock = "--"
		this.breakClock = "--";
		this.timer = null;
		this.start = props.start || null;
		this.breaks = [];
		this.pauses = [];
		this.height = Dimensions.get('window').height;
		this.width = Dimensions.get('window').width;
		this.rate = props.rate;
		this.dialog = null;
		this.client = props.client;
		this.title = props.title;
		this.index = props.index || ' N/A';
		this.saved = props.saved;
		this.main = props.main;

	}
	componentWillUpdate(){
		clearInterval(this.timer);
		const time = this.mil2Time((this.state.time - this.start));
		const breakTime = this.mil2Time(this.state.break);
		this.clock = `${time.hour} : ${time.minute} : ${time.seconds}`;
		this.breakClock = `${breakTime.hour} : ${breakTime.minute} : ${breakTime.seconds}`;
		this.pay = ((this.rate / 60) * time.minute) + (((this.rate / 60) / 60) * time.seconds) || 0;
	}
	confirm(message){
		this.dialog = message;
	}
	componentWillMount(){
		this.saved ? this.init = false : null;
		
	}
	componentDidMount(){

	}
	save(){
		AsyncStorage.getItem('timers')
		.then((timers) => {
			timers = JSON.parse(timers) || []; 
			console.log(timers);
			if(this.saved) timers = timers.map((time) => {
				console.log(time);
				if(timer.title === this.title && timer.client === this.client){
					//save data
					console.log('save data');
					timer.title = "New Title";
					return timer;					
				}
			})
			else{
				timers.push({
					
						title: this.title,
						client: this.client,
						rate: this.rate,
						start: this.start
					
				});
			}
			
			AsyncStorage.setItem("timers", JSON.stringify(timers));
			console.log(timers);
			this.saved = true;
		})
		.catch((err) => {
			if(err){
				// AsyncStorage.setItem("timers", JSON.stringify([{
				// 	props: {
				// 		title: this.title,
				// 		client: this.client,
				// 		start: this.start,
				// 		rate: this.rate
				// 	}
					
				// }]));
			}
		});
	}
	reset(){
		this.init = true;
		const time = null;
		this.setState({isRunning: false, time, break: 0, paused: 0});
		this.start = null;
		this.breaks = [];
		this.pauses = [];
		this.onBreak = false;
		this.dialog = null;
		this.pay = 0;
		this.clock = '--';
		this.breakClock = '--'
	}
	mil2Time(time){
		let day, hour, minute, seconds;
		seconds = Math.floor(time / 1000);
		minute = Math.floor(seconds / 60);
		seconds = this.addZero(seconds % 60);
		hour = Math.floor(minute / 60);
		minute = this.addZero(minute % 60);
		day = Math.floor(hour / 24);
		hour = this.addZero(hour % 24);

		
		return {
			seconds,
			minute,
			hour,
			day
		}
	}
	size(px){((this.width + this.height) / 1000) * px;}
	addZero(num){
		num = String(num);
		if(num < 0 || this.init) return '00';
		if(num.length === 1){
			num = num.split('');
			num.unshift("0");
			num = num.join('');
		  }
		return num;
	}
	render(){
		this.timer =  
			setInterval(() =>
				this.state.isRunning ? 
					this.onBreak ? 
						this.setState({break: this.state.break + 1000})  
					: 
						this.setState({time:Date.now() - 
							(this.breaks.length ? this.breaks.reduce((a,b) => a + b) : 0 ) - 
							(this.pauses.length ? this.pauses.reduce((a,b) => a + b) : 0 )}) 
					
				:
					!this.init ? 
						this.setState({paused: this.state.paused + 1000})
					:
						null
			, 1000);
		return (
			<View 
				style={
					Object.assign(
						this.state.isRunning ? 
							this.onBreak ? 
								{backgroundColor: 'blue'} 
							: 
								{backgroundColor: 'limegreen'} 
						: 
							this.init ? 
								{backgroundColor: 'black'} //DEFAULT COLOR
							: 
								{backgroundColor: 'orange'}
					, timerStyle.container) 
				}
			>
				{
					this.dialog ? 
						<View style={{display: 'flex', flexDirection: 'row', backgroundColor: 'pink', width: '100%', alignItems:'center', justifyContent: 'space-between', flex: 1}}>
							<Text style={{color: 'white', marginLeft: '2%'}}>{this.dialog}</Text>
							<View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', margin: '1%'}}>
								<TouchableHighlight
									onPress={() => this.reset()} 
									style={{
										backgroundColor: 'red', 
										width: 40, 
										height: 40,
										display: 'flex', margin: '1%',
										justifyContent: 'center', alignItems: 'center'
									}}
								>
									<Text style={{color: 'white'}}>
									Y
									</Text>
								</TouchableHighlight>
								<TouchableHighlight
									onPress={() => this.dialog = null} 
									style={{
										backgroundColor: 'red', 
										width: 40, 
										height: 40,
										display: 'flex',
										justifyContent: 'center', alignItems: 'center'
									}}
								>
									<Text style={{color: 'white'}}>
									N
									</Text>
								</TouchableHighlight>
																	
							</View>
						</View> 
					: null
				}
				<View style={{width: '100%',padding: '2%'}}>
					<Text style={{color: 'white', textAlign: 'center', width: '100%', fontSize: 20, fontWeight: "700"}}>{this.title || 'Untitled'}{this.index}</Text>
					{this.saved ? <Text style={{color: 'white', textAlign: 'center', width: '100%', fontSize: 10}}>SAVED</Text> : null}
				
				</View>
				<View style={{width: '100%',paddingVertical: '2%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '2%'}}>
					<Text style={{color: 'white', textAlign: 'left'}}>{`Client: ${this.client || '--'}`}</Text>
					<Text 
						style={{
							color: 'white', 
							fontSize: this.size(10)
						}}
					>
						Rate: {`$${this.rate || 0}/hr`} 
					</Text>
				</View>
				<View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', flex: 1, padding: '2%'}}>
					<Text 
						style={{
							color: 'white', 
							fontSize: this.size(10)
						}}
					>
						StartedOn: {this.start ? `${new Date(this.start).toLocaleDateString()}` :  "Not Started"} 
					</Text>
					<Text 
						style={{
							color: 'white', 
							fontSize: this.size(10)
						}}
					>
						{this.start ? `${new Date(this.start).toLocaleTimeString()}` : null}
					</Text>
					
				</View>
				<View style={{display: 'flex', flexDirection: 'row'}}>

					<View 
						style={{
							display: 'flex', 
							padding: 10, 
							flexDirection: 'column', 
							justifyContent: 'center', 
							alignItems: 'center'
						}}
					>
						
						<Text 
							style={{
								color: 'white', 
								fontSize: this.size(10)
							}}
						>
							BREAKS
						</Text>

						<Text 
							style={{
								color: 'white', 
								fontSize: this.size(10)
							}}
						>
							{this.breakClock}
						</Text>
						<Text 
							style={{
								color: 'white', 
								fontSize: 50
							}}
						>
							{this.breaks.length}
						</Text>
					</View>

					<View style={{display: 'flex', flex: 1, padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{color: 'white', fontSize: this.size(10)}}>${!Number.isNaN(Number(this.pay)) ? Number(this.pay).toFixed(2): 0}</Text>
					</View>

					<View style={{display: 'flex', padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{color: 'white', fontSize: this.size(10)}}>TIMER</Text>
						<Text style={{color: 'white', fontSize: this.size(10)}}>{this.clock}</Text>
					</View>

				</View>
				<View style={{display: 'flex', flex: 1, padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

					{
						this.state.isRunning ?
							<Button onPress={() => {
								if(this.state.isRunning){
									if(this.onBreak){
										this.breaks.push(this.state.break);
										this.setState({break: 0});
										this.onBreak = false;
									}else{
										this.onBreak = true;
									}
								}
								
							}} title={this.onBreak ? "Return" : "Break"}/>
						:
							null
					}

					<Button onPress={() => {
						this.setState({isRunning: !this.state.isRunning});
						if(this.init) {this.start = Date.now(); this.init = false;}
						if(this.state.paused) {
							this.pauses.push(this.state.paused);
							this.setState({paused: 0});
						}
					
					}} title={this.state.isRunning ? "Pause" : this.init ? "Start" : "Continue"}/>

					{
						!this.init ? 
							<Button onPress={() => {
								this.confirm("Delete Session?");
							}} title="Reset"/> 
						: 
							null
					}
					{
						<Button onPress={() => this.save()} title="SAVE" />
					}
				</View>
			</View>
		)
	}
}

const timerStyle = StyleSheet.create(require('../styles').timer);