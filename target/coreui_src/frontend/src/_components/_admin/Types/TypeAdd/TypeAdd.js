import React, { Component } from 'react';
import { AttributeListGroup} from '_components/_common';
import {WaitingPane} from "_components/_common";
import {typeService} from "_services/type.services";
import {toast} from "react-toastify";

class TypeAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {},
            errors:[]
        }

        this.createType = this.createType.bind(this)
        this.attributesList = this.attributesList.bind(this);
    }

    createType(formData) {
        this.setState({loading:true})

        if(this.props.rootType !== true){
            formData.parentTypeId = this.props.parentTypeId;
            formData.rootType = false;
        }
        else {
            formData.rootType = true;
        }

        formData.containerId = this.props.containerId;
        typeService.createType(formData, this.props.containerId).then(response => {
            this.props.onCreateSuccess(this.props.rootType);
            toast.success("Le type a été créé avec succès")
        })
    }

    /**
     * Attributes list
     */
    attributesList(){
        const attributesList = {
            formId: 'dt-form',
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => this.createType(formData),
            attributes: [
                {name: 'Nom', dataField: 'name', required:true,  placeHolder: 'Nom'},
                {name: 'Nom logique', dataField: 'logicalName',  required: true},
                {name: 'Description', dataField: 'description',  required: true, placeHolder: 'Description'},
                {name: 'I18n', dataField: 'i18nKey',  required: true, placeHolder: 'Internationalisation'},
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
                <div id="form-errors-section" className="form-error">
                    {errors}
                </div>
                {!this.props.rootType && <p style={{'margin-bottom':'2rem'}}><strong>Type parent</strong>&nbsp;&nbsp;&nbsp;{this.props.parentTypeName}</p>}
                <AttributeListGroup
                    attributesListConfig={this.attributesList()}
                    data={formData}
                    standardFooterActions="true"
                    formMode='create_object'/>
            </div>
        )
    }
}

export default TypeAdd;
