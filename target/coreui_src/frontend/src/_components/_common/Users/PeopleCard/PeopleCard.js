import React, { Component } from 'react';
import {Button,} from 'reactstrap';
import { ThumbInfo} from '_components/_common';

class PeopleCard extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			loading:false,
			peopleType: props.peopleType,
			people: props.people,
			account: props.account,
			
			orgDetailsLink: props.orgDetailsLink,
			personDetailsLink: props.personDetailsLink,
		}
	}
	
	blockUser(e, userAccountId){
		e.preventDefault()
		this.props.blockUser(userAccountId)
	}

	unsubscribe(e){
		e.preventDefault()
		let userAccountId = this.state.account.id
		this.props.unsubscribe(userAccountId)
	}

	
	loading(){
		return (<span>Loading...</span>)
	}
	
	getTitle(people){
		return "title"
	}
	
	getDisplay(){
		let type = this.state.peopleType.logicalPath,
		cardImage, link = this.props.personDetailsLink(this.state.people);
		
		const thumb = <ThumbInfo 
				canEdit={false} 
				width="90"
				height="90"
				thumbedId={this.state.people.id} /> 
		
		let title
		if(this.state.peopleType.logicalPath.startsWith('com.katappult.people.Party/Organization/')){
			if(this.props.orgDetailsLink !== null){
				title = this.props.orgDetailsLink(this.state.people)
			}
			else {
				title = this.state.people.addressageName
			}
		}
		else {
			if(this.props.personDetailsLink !== null){
				title = this.props.personDetailsLink(this.state.people)
			}
			else {
				title = this.state.people.firstName + ' ' + this.state.people.lastName
			}
		}
		
		return <table>
				<tr>
					<td>
						<div className="">
							{thumb}
						</div>
					</td>
					<td>
						<div>
		                  	<p align="left"><h5>{title}</h5></p>
		                </div>
		                <div>
		                	<Button onClick={e => this.blockUser(e, this.props.account.id)}>BLOCK</Button>
		                	<Button onClick={e => this.unsubscribe(e, this.props.account.id)}>UNSUBSCRIBE</Button>
		                </div>
					</td>
				</tr>
	          </table>
	}
	
	render() {
		if(this.state.loading){
			return this.loading()
		}
		
		if(this.state.peopleType === null || 
				this.state.peopleType === undefined){
			return <div>Unkown people type!</div>
		}
		
		const { peopleType, people, account} = this.state;
		return this.getDisplay()
	}
}

export default PeopleCard;


