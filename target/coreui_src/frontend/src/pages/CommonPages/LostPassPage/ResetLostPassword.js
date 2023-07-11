/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, 
	CardGroup,
	Card, CardBody,
	CardFooter, Col, 
	Container, 
	Form, Input, 
	InputGroup, InputGroupAddon, 
	InputGroupText, Row
} 
from 'reactstrap';
import PropTypes from 'prop-types';
import { accountService } from '_services/account.services.js';
import logo from '../../../assets/img/brand/logo.png'

const propTypes = {
	token: PropTypes.string,
	email: PropTypes.string,
}

const defaultProps = {
	token: '',
	email: ''
}

/**
 * Reset password when the user has lost his password.
 * Form without old pawwsord
 */
class ResetLostPassword extends React.Component {

	constructor(props) {
		super(props);
		this.state ={
			formErrors: ''
		}

		this.doResetLostPassword = this.doResetLostPassword.bind(this);
  	}

   /**
   * Do reset password
   */
  doResetLostPassword(e){
	e.preventDefault()
	let token = this.url.params.token
	let email = this.state.email

	accountService
	.resetLostPassword(email, token)
	.then(response => {
		
	})
	.then(json => {
		
	})
	.catch(error => {
    	this.handleResponseError(error);
    });
  }
  /**
   * React render
   */
  render() {
    return (
    	<div className="app flex-row align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md="8">
                        <CardGroup>
                            <Card className="p-4">
                            	<CardBody>
	                            	<div>
	                    			<img src={logo} className="img-avatar" alt="logo" width="60"/>
	                    			<h1>RESET PASSWORD</h1>
	                    			<hr/>
	                    			<h5>Please provide your new password</h5>
	                    		</div>
		                        	<Form>
		          	                  <div className="spacer-20">&nbsp;</div>
		          	                  <div>{this.state.formErrors}</div>
		          	                  <InputGroup className="mb-3">
		          	                    <InputGroupAddon addonType="prepend">
		          	                      <InputGroupText>
		          	                        <i className="icon-lock"></i>
		          	                      </InputGroupText>
		          	                    </InputGroupAddon>
		          	                    <Input type="text" name="password" placeholder="Your password" autoComplete="login" onChange={(e) => this.handleUserInput(e)}/>
		          	                  </InputGroup>
		          	                  <InputGroup className="mb-3">
		          	                    <InputGroupAddon addonType="prepend">
		          	                      <InputGroupText>
		          	                        <i className="icon-lock"></i>
		          	                      </InputGroupText>
		          	                    </InputGroupAddon>
		          	                    <Input type="text" name="validatePassword" placeholder="Validate password" autoComplete="login" onChange={(e) => this.handleUserInput(e)}/>
		          	                  </InputGroup>
		          	                </Form>
	                            	</CardBody>
	                            	<CardFooter>
		                        		<Row>
		                        			<Col lx="6" lg="6">
		                        				<Button block color="primary">DONE</Button>
		                        			</Col>
		                        		</Row>
		                        	</CardFooter>
	                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
  }
}

ResetLostPassword.propTypes = propTypes;
ResetLostPassword.defaultProps = defaultProps;


export default ResetLostPassword;

