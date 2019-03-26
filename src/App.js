import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from './lottery';


class App extends Component {
	state = {
		manager: '',
		players: [],
		balance: '',
		value: '',
		message: ''
	};
	// life cycle method -> it will be called when our component gets rendered for the first time.
	async componentDidMount() {
		const manager = await lottery.methods.manager().call();
		const players = await lottery.methods.getPlayers().call();
		const balance = await web3.eth.getBalance(lottery.options.address);
		this.setState({manager, players, balance});
	}
	onSubmit = async (event) => { // we need not worry about value of this in side the functions declared this way
		event.preventDefault(); // to make sure that the form does not submit itself

		// for sending transactions we've retrieve the list of accounts from the web3 object and specify the acnt that is going to be used to send the money over to that paticular func that exists in our contract. (for the web3 lib version that we are using)
		const accounts = await web3.eth.getAccounts();

		this.setState({ message: 'Waiting on Transaction success...' })

		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(this.state.value, 'ether')
		});

		this.setState({ message: 'You have been entered!' });
	};
	onClick = async () => {
		const accounts = await web3.eth.getAccounts();

		this.setState({ message: 'Waiting on Transaction success...' });

		await lottery.methods.pickWinner().send({
			from: accounts[0]
		});

		this.setState({ message: 'A winner has been picked!' })	
	};

	render() {
		// console.log(web3.version);
		// web3.eth.getAccounts().then(console.log);

		return (
			<div>
				<h2>Lottery Contract</h2>
				<p>
					This Contract is managed by {this.state.manager}
				</p>
				<p>
					There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
				</p>
				<hr />
				<form onSubmit={this.onSubmit} >
					<h4>Want to try your luck?</h4>
					<div>
						<label>Amount of ether to enter</label>
						<input
							value = {this.state.value}
							onChange = {event => this.setState({ value: event.target.value })}
						/>
					</div>
					<button>
						Enter 
					</button>
				</form>

				<hr />

				<h4>Ready to pick a winner?</h4>
				<button onClick = {this.onClick}>Pick a Winner !</button>

				<hr />
				<h1> {this.state.message} </h1>
			</div>
		);
	}
}

export default App;
