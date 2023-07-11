import React, { Component } from 'react';
import { AttributeListGroup} from '_components/_common';
import {WaitingPane} from "_components/_common";
import {typeService} from "_services/type.services";

class TypeUpdateBaseClass extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors:[]
        }

        this.updateBaseClass = this.updateBaseClass.bind(this)
    }

    updateBaseClass(formData) {
        this.setState({loading:true})
        if(formData.baseClass){
            formData.containerId = this.props.containerId;
            typeService.updateBaseClass(this.props.typeId, formData, this.props.containerId).then(response => {
                this.props.onSuccess();
            })
        }
    }

    /**
     * Attributes list
     */
    attributesList(){
        const attributesList = {
            formId: 'dt-form',
            saveButtonTitle: 'Modifier',
            onSubmit: (formData) => this.updateBaseClass(formData),
            attributes: [
                {name: 'Classe', dataField: 'baseClass', required:true,  placeHolder: 'Classe java de base'},
            ]
        }

        return attributesList;
    }

    render() {
        if(this.state.loading){
            return <WaitingPane/>
        }

        let errors = []
        if(this.state.errors.length > 0) {
            this.state.errors.map(error => {
                errors.push(<p>{error}</p>)
            })
        }

        let formData ={...this.state.formData}
        return (
            <div className="container-create-root">
                <div id="form-errors-section" className="form-error">{errors}</div>
                <AttributeListGroup
                    attributesListConfig={this.attributesList()}
                    data={formData}
                    standardFooterActions="true"
                    formMode='create_object'/>
            </div>
        )
    }
}

export default TypeUpdateBaseClass;
