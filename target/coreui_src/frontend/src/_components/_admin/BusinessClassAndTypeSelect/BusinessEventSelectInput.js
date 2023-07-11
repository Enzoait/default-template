import React, { Component } from 'react';
import { Input} from 'reactstrap';
import { businessRulesService } from '_services/business.rule.services';

/**
 * Business event select input
 */
class BusinessEventSelectInput extends Component {

    constructor(props) {
        super(props);
        this.state ={
            items: '',
        }

        this.onChange = this.onChange.bind(this)
    }

    componentDidMount(){
        businessRulesService.getAllBusinessEvent(this.props.containerId).then(json => {
            return json;
        })
        .then(json => {
        	this.setState({
                items: JSON.stringify(json.metaData),
            })
        })
        .catch(error => {
        	console.error(error);
        });
    }

    onChange(e){
    	if(this.props.businessEventChangeFunction){
    		this.props.businessEventChangeFunction(e)
    	}
    }

    render() {
        const options = [];
        if(this.state.items){
            const items = JSON.parse(this.state.items);
            items.event.map(i => {
                options.push(<option value={i}>{i}</option>)
            });
        }

        return (
            <React.Fragment>
                <Input className="admin-filters-search-input"
                	value={this.props.defaultValue} type="select"
                	name="select" id="select" onChange={this.onChange}>
                    <option value="">Tous les événements</option>
                    {options}
                </Input>
            </React.Fragment>
        )
    }
}

export default BusinessEventSelectInput;
