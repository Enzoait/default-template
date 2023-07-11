import React, { Component } from 'react';

class WaitingPane extends Component {

	constructor(props){
		super(props)
	}

	render() {
		let waitingMessage = 'Veuillez patienter...';
		if(this.props.waitingMessage){
			waitingMessage = this.props.waitingMessage;
		}

		let className, notbordered = this.props.bordered === false || this.props.bordered === null || this.props.bordered === undefined;
		return  <div className="waiting-pane">
			<div className={'app-loading'}>
				<div className="lds-facebook">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</div>

	}
}

export default WaitingPane;
