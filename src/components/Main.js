import React from 'react';
import Grid from './Grid'
import Buttons from './Buttons'
/* Features to add:
	-Speed as a scrollable input bar would be cool
	- Live cell count and history
*/
class Main extends React.Component {
	constructor(){
		super();
		this.speed = 500
		this.rows = 30
		this.cols = 50

		this.state = {
			generation: 0,
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}

		// this.selectBox = this.selectBox.bind(this)
		this.seed = this.seed.bind(this)
		// this.playButton = this.playButton.bind(this)
		// this.play = this.play.bind(this)
		this.gridSize = this.gridSize.bind(this)
	}

	selectBox = (row, col) => {
		let gridCopy = arrayClone(this.state.gridFull);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			gridFull: gridCopy
		})
	}

	playButton = (speed) => {
		clearInterval(this.intervalId)
		var newSpeed = speed || this.speed
		this.intervalId = setInterval(this.play, newSpeed)
	}

	pauseButton = () => {
		clearInterval(this.intervalId)
	}

	fast = () => {
		this.playButton(100);
	}

	slow = () => {
		this.playButton(1000);
	}

	clear = () => {
		//Refactor
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		this.setState({
			gridFull: grid,
			generation: 0
		})
	}

	gridSize(size){
		switch (size){
			case "1":
				this.cols = 20
				this.rows = 10
			break
			case "2":
				this.cols = 50
				this.rows = 30
			break
			default:
				this.cols = 70
				this.rows = 50
		}
		this.pauseButton();
		this.clear();
	}

	play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});
	}
	seed(){
		let gridCopy = arrayClone(this.state.gridFull);
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.cols; j++){
				if (Math.floor(Math.random() * 4) === 1){
					gridCopy[i][j] = true;
				}
			}
		}
		this.setState({
			gridFull: gridCopy
		});
	}

	componentDidMount(){
		this.seed();
		this.playButton();
	}
	render(){
		return (
			<div>
				<h1>The Game of Life</h1>
				<Buttons
					playButton={this.playButton}
					pauseButton={this.pauseButton}
					slow={this.slow}
					fast={this.fast}
					clear={this.clear}
					seed={this.seed}
					gridSize={this.gridSize}
				/>
				<Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/>
				<h2>Generations: {this.state.generation}</h2>
			</div>
		)
	}
}

function arrayClone(arr){
	return JSON.parse(JSON.stringify(arr));
}

export default Main