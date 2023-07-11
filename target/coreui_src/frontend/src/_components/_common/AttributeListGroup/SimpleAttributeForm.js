import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	ButtonGroup,
	Input,
	Label,
} from 'reactstrap';
import {commons} from '_helpers/commons';

const propTypes = {
	items: PropTypes.array.isRequired,
	attribute: PropTypes.array.object,
};

const defaultProps = {
	items: [],
};

class SimpleAttributeForm extends Component{

	constructor(props){
		super(props)
		this.state = {
			mode: 'view'
		}
	}

	rowActions(attribute){
		const rowActions = attribute.items.rowActions ? attribute.items.rowActions() : '';
		return 	(
			<tr>
				<td colspan="2"  align="right">{rowActions}</td>
			</tr>
		)
	}

    simpleVRow(attribute) {
        const data = this.props.data;
        let val = commons.getPropByString(data, attribute.dataField);
        let editor = commons.getInputType(attribute);
        return (<React.Fragment>
            <tr>
                <td>{attribute.name}</td>
            </tr>
            <tr>
                <td><Input type={editor} value={val}/></td>
            </tr>
        </React.Fragment>
        )
    }

    simpleHRow(attribute) {
        const data = this.props.data;
        let val = commons.getPropByString(data, attribute.dataField);
        let editor = commons.getInputType(attribute);
        return (
            <React.Fragment>
                <tr>
                    <td><Label className="control-label-view">{attribute.name}</Label></td>
                    <td><Input type={editor} value={val}/></td>
                </tr>
           </React.Fragment>
        )
    }

	footerActions() {
		if(this.state.mode ===  'edit'){
			return <React.Fragment>
				<ButtonGroup>
					<Button  color="primary" size="md" onClick={(e) => this.save(e)}>AJOUTER</Button>
					<Button  color="primary" size="md" onClick={(e) => this.cancel(e)}>ANNULER</Button>
					<Button color="primary" size="md" onClick={(e) => this.add(e)}>AJOUTER</Button>
				</ButtonGroup>
	        </React.Fragment>
		}
		else {
			return <React.Fragment>
				<Button block color="primary" size="md" onClick={(e) => this.edit(e)}><i className="fa fa-pencil"></i> EDIT</Button>
	        </React.Fragment>
		}
	}


	render(){
		return (
			<React.Fragment>

			</React.Fragment>
		)
	}
}


SimpleAttributeForm.propTypes = propTypes;
SimpleAttributeForm.defaultProps = defaultProps;

export default SimpleAttributeForm;
