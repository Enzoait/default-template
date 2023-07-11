import React, { Component } from 'react';
import { Form, 
	FormGroup, Label, 
	Input, FormText, 
	Col, Row, 
	ListGroup, ListGroupItem,
	CardBody, Button,Card
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
	item: PropTypes.any,
};

const defaultProps = {
	item: {}, 
};

class ViewDefinition extends Component {
    render(){
        return (
            <React.Fragment>
                    <Row>
                        <Col md="12">
                            <Card>
                            <CardBody>
                                <Form action="" method="post">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="email-input">Identifier</Label>
                                        </Col>
                                        <Col xs="12" md="12">
                                            <Input type="text" id="view-id" name="view-id" placeholder="View identifier"/>
                                            <FormText className="help-block">The unique identifier of the view. Avoid special characters.</FormText>
                                            <FormText className="help-block">This identifier is used to query views associated to this type.</FormText>
                                        </Col>
                                        <Col xs="12" md="12">
                                            <Button  color="danger" className="float-right">Update</Button>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <ListGroup>
                                <ListGroupItem className="justify-content-between">UI Schema definition<Button  color="danger" className="float-right">View</Button></ListGroupItem>
                                <ListGroupItem className="justify-content-between">Web UI<Button  color="primary" className="float-right">View</Button></ListGroupItem>
                                <ListGroupItem className="justify-content-between">Mobile UI<Button  color="primary" className="float-right">View</Button></ListGroupItem>
                                <ListGroupItem className="justify-content-between">Desktop UI<Button  color="primary" className="float-right">View</Button></ListGroupItem>
                            </ListGroup>
                        </Col>
                </Row>
            
        </React.Fragment>
        )
    }    
}

ViewDefinition.propTypes = propTypes;
ViewDefinition.defaultProps = defaultProps;

export default ViewDefinition;


