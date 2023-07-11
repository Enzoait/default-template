import React from 'react';
import { Button, 
	CardGroup,
	Card, CardBody, 
	CardFooter, Col, 
	Row
} 
from 'reactstrap';

/**
 * LostPassSuccess component
 */
class LostPassSuccess extends React.Component {

	 constructor(props) {
	    super(props);
	    this.backToLogin = this.backToLogin.bind(this)
	 }
	 /**
	  * Go back to login page
	  */
	 backToLogin(){
		 let loginURL = process.env.REACT_APP_CLIENT_LOGIN_URL;
		 window.location.href = loginURL;
	 }
    /**
     * Render the view
     */
    render() {
        return (
            <CardGroup>
                <Card className="no-border">
                	<CardBody>
                		<div>
	            			<p className="display-6">To reset your password, please check the email sent to the email address you have provided. </p>
	            			<div className="spacer-20">&nbsp;</div>
	            			<h4>{this.props.email}</h4>
	            			<div className="spacer-20">&nbsp;</div>
	            		</div>
                	</CardBody>
                	<CardFooter>
		                <Row>
		        			<Col xl="12" lg="12">
		        				<Button block size="lg" color="primary" onClick={(e) => this.backToLogin(e)}>Home</Button>
		        			</Col>
		        		</Row>
                	</CardFooter>
                </Card>
            </CardGroup>
        );
    }
}

export default LostPassSuccess;

