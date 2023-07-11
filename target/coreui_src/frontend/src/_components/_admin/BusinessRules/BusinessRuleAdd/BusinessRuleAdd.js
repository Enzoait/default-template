import React, {Component} from 'react';
import {AttributeListGroup, WaitingPane} from '_components/_common';
import {BusinessClassAndTypeSelect} from "_components/_admin";
import {toast} from "react-toastify";
import {businessRulesService} from "_services/business.rule.services";
import {Form} from "react-bootstrap";
import {Input} from "reactstrap";

class BusinessRuleAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {
                phase: '0',
                vetoable: true,
                event: 'PRE_SET_STATE',
                order: 10
            },
            errors: [],
        }

        this.createBusinessRule = this.createBusinessRule.bind(this)
        this.displaySelectFunction = this.displaySelectFunction.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onBusinessClassChange = this.onBusinessClassChange.bind(this)
    }

    async createBusinessRule(formData) {

        let form = {...this.state.formData}
        form.containerId = this.props.containerId;
        form.order = formData.order
        form.rule = this.props.baseRule.attributes.name
        form.identifier = formData.identifier
        form.description = formData.description

        if (form.event && form.businessClass && form.identifier && form.order && form.order > 0 && form.rule) {
            this.setState({loading: true})

            businessRulesService.createBusinessRule(form, this.props.containerId).then(response => {
                this.setState({loading: false})
                this.props.onCreateSucess();
                toast.success("La règle a été créée")
            })
        }
    }

    getBusinessTypeAndClassSelect() {
        const comp = <BusinessClassAndTypeSelect
            {...this.props}
            displayFunction={this.displaySelectFunction}
            updateFunction={this.onBusinessClassChange}
            mandatorySubType={false}/>

        return comp;
    }

    onBusinessClassChange(businessClass, businessType) {
        let formData = {...this.state.formData}
        formData['businessClass'] = businessClass
        formData['businessType'] = businessType ? businessType : ''
        this.setState({formData: formData})
    }

    handleChange(event) {
        let formData = {...this.state.formData}
        formData[event.target.name] = event.target.value
        this.setState({formData: formData})
    }

    vetoable() {
        let vetoable;
        if (this.state.formData.phase === '0') {
            vetoable = <Form.Check style={{
                'margin-top': '1.2rem',
                'margin-bottom': '1.2rem',
                'margin-left': '-0.5rem'
            }}
               id="vetoable_check"
               name="vetoable"
               onChange={this.handleChange}
               value={this.state.formData.vetoable}
               checked={this.state.formData.vetoable}
               label="Cette règle annule tout le traitement"
            />
        }

        return vetoable;
    }

    lifecyclePhase() {
        return (
            <Input value={this.state.formData.phase} type="select" name="phase" id="phase" onChange={this.handleChange}>
                <option value="0">Avant commit</option>
                <option value="1">Après commit</option>
                <option value="2">Après rollback (erreur de commit)</option>
            </Input>
        )
    }

    evenement() {
        return (
            <Input value={this.state.formData.event} type="select" name="event" id="event" onChange={this.handleChange}>
                <option value="PRE_SET_STATE">PRE_SET_STATE</option>
                <option value="PRE_SET_STATE">PRE_SET_STATE</option>
                <option value="POST_SET_STATE">POST_SET_STATE</option>
            </Input>
        )
    }

    attributesList() {
        const attributesList = {
            formId: 'dt-form',
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.createBusinessRule(formData),
            attributes: [
                {name: 'Ordre', dataField: 'order', required: true, placeHolder: 'ordre', type: 'number'},
                {name: 'Identification', dataField: 'identifier', required: true, placeHolder: 'Identification'},
                {name: 'Description', dataField: 'description', required: false, placeHolder: 'Description'}
            ]
        }

        return attributesList;
    }

    displaySelectFunction(businessClass, businessTypes) {
        return (<>
                <div>{businessClass}</div>
                <div>{businessTypes}</div>
            </>
        )
    }

    render() {
        if (this.state.loading) {
            return <WaitingPane/>
        }

        let errors = []
        if (this.state.errors.length > 0) {
            this.state.errors.map(error => {
                errors.push(<p>{error}</p>)
            })
        }

        let formData = {...this.state.formData}
        return (
            <div className="container-create-root">
                <div id="form-errors-section" className="form-error">
                    {errors}
                </div>
                <p style={{'margin-bottom': '2rem'}}><strong>Règle de
                    base</strong> : {this.props.baseRule.attributes.name}
                </p>

                {this.getBusinessTypeAndClassSelect()}
                {this.evenement()}
                {this.lifecyclePhase()}
                {this.vetoable()}

                <AttributeListGroup
                    attributesListConfig={this.attributesList()}
                    data={formData}
                    standardFooterActions="true"
                    formMode='create_object'/>
            </div>
        )
    }
}

export default BusinessRuleAdd;
