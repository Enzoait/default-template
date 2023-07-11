import React from 'react';
import { RiLockPasswordLine } from "react-icons/ri";
import {UpdatePassword, WaitingPane} from '_components/_common';
import {accountService} from "_services/account.services";
import './ReinitPass.css';
import {coreUri} from "_helpers/CoreUri";

class ReinitPassPage extends React.Component {

	 constructor(props) {
	    super(props);
	    this.state = {
	    	loading: true
	    };
	 }

	 backToHome(){
		window.location.href = coreUri.clientSideRenderedURL('/');
	 }

	 componentDidMount(){
		 let token = this.props.match.params.lockToken
		 if(!token){
		 	this.backToHome()
		 }

		 accountService.isValidAccountLockToken(token).then(response => {
			 if(response && response.metaData.valid === true){
				this.setState({valid: true, loading:false})
			 }
			 else {
				 this.setState({valid: false, loading:false})
				 this.backToHome()
			 }
		 }).catch(() =>{
			 this.backToHome()
		 })
	 }

    render() {
    	if(this.state.loading){
    		return <WaitingPane />
		}

		let	content = <>
 				<div className="">
 					<center>
 						<RiLockPasswordLine size="3em"/>
 					</center>
            		<div className="reinitpass-label">Réinitialiser le mote de passe</div>
 				</div>
	 			<UpdatePassword {...this.props} reinitLostPass={true}/>
    		</>

        return (<>
        		<div className="reinit-pass-page">
	              		<center className="">
							<img src={process.env.PUBLIC_URL + '/assets/img/katappult_colored.svg'} width="220" className="" alt="katappult.tech"/>
						</center>
				        <div className="reinitpass-area">
							{content}
				        </div>
				</div>
	       </>
        );
    }
}

export default ReinitPassPage;

