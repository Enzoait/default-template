import React, { Component } from 'react';
import {
    Container, Col, 
    Row, 
    Card, 
    Jumbotron,
    CardBody,
    Spinner,
} from 'reactstrap';
import {commons} from '_helpers/commons';

class ContainerMembershipRequests extends Component {

	constructor(props){
		super(props)
		this.state ={
			loading: false,
			members: [],
			
			queryFilters:{
				page: 0,
				pageSize: 10,
			}
		}
	}
	emptyTable(){
		let containerName = commons.getWorkingContainerName(this.props.userContext);
		return (  
			<div className="flex-row align-items-center">
			        <Row className="justify-content-center">
				        <Col xs="12" sm="12" md="12" lg="12" xl="12">
				            <Card className="no-radius">
				                <CardBody>
				                    <Jumbotron className="">
				                        <Container>
				                            <h3 className="display-3">No request</h3>
				                            <p className='lead'><strong>{containerName}, does not have any pending membership request.</strong></p>
				                        </Container>
				                    </Jumbotron>
				                </CardBody>
				            </Card>
				        </Col>
				    </Row>
			</div>
		)
	}
	loading(){
		return (
			<Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Card className="no-radius">
                    <CardBody>
                        <Jumbotron className="">
                        	<div className="text-center">
	                        	<Spinner animation="grow" role="status">
	                        	  <span className="sr-only">Loading...</span>
	                        	</Spinner>
                            </div>    
                        </Jumbotron>
                    </CardBody>
                </Card>
			</Col>
		)
	}
	
	componentDidUpdate(prevProps, prevState){	
	}
	
    render() {
    	if(this.state.loading){
    		return this.loading()
    	}
    	
    	if(this.state.members.length <= 0){
    		return this.emptyTable()
    	}
    	
        return (
            <div>
            	Content
            </div>
        );
    }
}


export default ContainerMembershipRequests


