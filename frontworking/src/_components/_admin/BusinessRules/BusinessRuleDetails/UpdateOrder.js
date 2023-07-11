/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { Button,
	Label,
	Form,
	Input, InputGroup,
}
from 'reactstrap';
import { businessRulesService } from '_services/business.rule.services';
import Modal from 'react-bootstrap/Modal'

class UpdateOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	  modal: false,
	  businessRuleId: props.businessRuleId,
	  formData: {
		  oldOrder: props.oldOrder,
		  order: props.oldOrder,
	  },
	  formError: ''
    };

	this.toggle = this.toggle.bind(this);
	this.doUpdate = this.doUpdate.bind(this);
	this.handleFormChange = this.handleFormChange.bind(this)
	this.updateSuccess = this.updateSuccess.bind(this)
  }

  handleFormChange(event) {
	let formadata = JSON.parse(JSON.stringify(this.state.formData));
	formadata[event.target.name] = event.target.value
	this.setState({
		formData: formadata,
	})
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  doUpdate(e) {
  	let form = {};
  	form.order = this.state.formData.order;

	businessRulesService.setOrder(this.state.businessRuleId, form, this.props.containerId).then(response => {
		this.updateSuccess();
	})
  }

  updateSuccess(){
	this.toggle()
	if(this.props.onUpdateSuccess){
		this.props.onUpdateSuccess(true);
	}
  }

  render() {
    return (
      <div>
        <Button className="ml-2 mr-2 action-button" onClick={this.toggle}><i className="fa fa-pencil fa-sm"></i>&nbsp;ORDRE</Button>
          <Modal show={this.state.modal}
				 size={"md"}
				 toggle={this.toggle} centered>
         	 <Modal.Header toggle={this.toggle}>MODIFIER L'ORDRE</Modal.Header>

          <Modal.Body>
				<Label className="form-error">{this.state.formError}</Label>
				<Form>
				  <InputGroup>
					<Input type="number" name="order" placeholder="Order" value={this.state.formData.order}
						autoComplete="new-order" onChange={(e) => this.handleFormChange(e)}/>
				  </InputGroup>
				</Form>
	      </Modal.Body>
          <Modal.Footer>
            	<Button color="primary" onClick={(e) => this.doUpdate(e)}>MODIFIER</Button>{' '}
            	<Button color="secondary" onClick={this.toggle}>ANNULER</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default UpdateOrder;
