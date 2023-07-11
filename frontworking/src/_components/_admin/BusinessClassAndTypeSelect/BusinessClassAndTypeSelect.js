import React, { Component } from 'react';
import {Input,} from 'reactstrap';
import PropTypes from 'prop-types';
import { businessRulesService } from '_services/business.rule.services';
import * as actions from "_actions/actions";
import {connect} from "react-redux";

const propTypes = {
  displayFunction: PropTypes.func,
}

const defaultProps = {};

const mapStateToProps = store => ({
    searchBusinessRulesRX : store.searchBusinessRules,
    /*businessType: store.searchBusinessRules.businessType,
    businessClass: store.searchBusinessRules.businessClass,
    vetoable: store.searchBusinessRules.vetoable,
    eventKey: store.searchBusinessRules.eventKey,
    phase: store.searchBusinessRules.phase,
    rules: store.searchBusinessRules.rules,
    includeParentRules: store.searchBusinessRules.includeParentRules,*/
})

const mapDispatchToProps = (disptach) => ({
    updateSearchCriterias: (e) => disptach(actions.updateBusinessRulesSearchCriterias(e)),
})

/**
 * Displays two select:
 * 1. One to select business classes
 * 2. One to select business type
 *
 * Both items are linked and auto update
 *
 */
class BusinessClassAndTypeSelect extends Component {

    constructor(props){
        super(props);

        this.state = {
            businessClasses: [],
            businessTypes: [],
            businessClass: this.props.searchBusinessRulesRX.businessClass ? this.props.searchBusinessRulesRX.businessClass : '',
            businessType: this.props.searchBusinessRulesRX.businessType ? this.props.searchBusinessRulesRX.businessType : ''
        }

        this.onBusinessSubtypeChange = this.onBusinessSubtypeChange.bind(this)
        this.onBusinessClassChange = this.onBusinessClassChange.bind(this)
    }

    onBusinessSubtypeChange(value){
    	if(this.props.updateFunction) {
    		this.props.updateFunction(this.state.businessClass, value)
    	}

        const searchBusinessRulesRX = {...this.props.searchBusinessRulesRX}
        searchBusinessRulesRX.businessType = value
        this.props.updateSearchCriterias(searchBusinessRulesRX)

    	this.setState({businessType: value})
    }

    onBusinessClassChange(event) {
    	let value = event.target.value;
        if(this.props.updateFunction) this.props.updateFunction(value, null)

        const searchBusinessRulesRX = {...this.props.searchBusinessRulesRX}
        searchBusinessRulesRX.businessClass = value
        this.props.updateSearchCriterias(searchBusinessRulesRX)

        businessRulesService.getAllBusinessTypes(value, this.props.containerId).then(json => {
            this.setState({
                businessTypes: json.data,
                businessType: '',
                businessClass: value
            })
        })
    }

    /**
     * Generates a select box with list of business classes.
     */
    businessClassesSelect(){
        let defaultSelection = this.props.searchBusinessRulesRX.businessClass,
        	businessClassOptions = [];

        this.state.businessClasses.map(item => {
            businessClassOptions.push(<option value={item.attributes.id}>{item.attributes.displayName}</option>);
        });

        let selectBusinessClass = (
            <Input value={defaultSelection} type="select" name="business-class"
            	id="business-class"
            	onChange={this.onBusinessClassChange.bind(this)}>
                <option value="">Selectionnez une entité...</option>
                {businessClassOptions}
            </Input>
        )

        return selectBusinessClass;
    }
    /**
     * When user selects a business class, fetch subtypes of that class and
     * display it into a select box.
     */
    businessTypesSelect(){
        let subtypesOptions = [];
        subtypesOptions.push(<option value=''>Selectionnez un type métier...</option>);

        if(this.state.businessTypes){
	        this.state.businessTypes.map(item => {
                subtypesOptions.push(<option value={item.attributes.id}>{item.attributes.displayName}</option>);
	        });
        }

        let selectBusinessType = (
            <Input value={this.props.defaultBusinessType}
                   type="select" name="business-type" id="business-type"
                   onChange={(e) => this.onBusinessSubtypeChange(e.target.value)}>
                {subtypesOptions}
            </Input>
        )

        return selectBusinessType;
    }

    componentDidMount(){
    	businessRulesService.selectableRootTypes(this.props.containerId).then(response => {
    		this.setState({businessClasses: response.data})
    	})

        // reload list of subtypes if defaultBusinessType is not empty
        if(this.props.defaultBusinessType){
            businessRulesService.getAllBusinessTypes(this.props.defaultBusinessClass, this.props.containerId).then(json => {
                this.setState({
                    businessTypes: json.data,
                })
            })
        }
    }

    render() {
        const businessTypesSelect= this.businessTypesSelect();
        let businessClassesSelect = this.businessClassesSelect();
        const display = this.props.displayFunction(businessClassesSelect, businessTypesSelect);
        return (
            <React.Fragment>{display}</React.Fragment>
        )
    }
}

BusinessClassAndTypeSelect.propTypes = propTypes;
BusinessClassAndTypeSelect.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps) (BusinessClassAndTypeSelect);
