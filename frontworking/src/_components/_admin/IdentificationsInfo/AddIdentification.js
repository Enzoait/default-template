import React, {useEffect, useState} from 'react';
import {typeService} from "_services/type.services";
import Form from "react-bootstrap/Form";
import {identificationsService} from "_services/identifications.service";
import {commons} from "_helpers/commons";
import {toast} from "react-toastify";
import {AttributeListGroup} from "_components/_common";

function AddIdentification(props) {

    const [formData, setFormData] = useState()
    const [businessType, setBusinessType] = useState()
    const [types, setTypes] = useState()
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const rootType = 'com.katappult.id.Identification'
        const containerId = props.containerId

        typeService.getByPath(rootType, containerId).then(response => {
            const id = response.data.attributes.id
            const firstElement = [response.data]

            typeService.getSubtypeOf(id, true, containerId).then(types => {
                const typeDatas = types.data
                setTypes(firstElement.concat(typeDatas))
                setBusinessType(rootType)
            })
        })
    }, [])

    const findFormErrors = (form) => {
        const {comment, identification} = form
        const newErrors = {}

        if (!comment || comment === '') newErrors.comment = 'Champs invalide';
        if (!identification || identification === '') newErrors.identification = 'Champs invalide';
        return newErrors;
    }

    const attributesList = () => {
        const attributesList = {
            saveButtonTitle: 'CRÉER',
            onSubmit: (formData) => create(formData),
            formValidity: (formData) => findFormErrors(formData),
            attributes: [
                {
                    name: "Identification",
                    dataField: "identification",
                    required: true,
                    placeHolder: "Identification",
                    type: "text",
                    invalidFeedBack: "Veuillez renseigner ce champs"
                },
                {
                    name: "Comment",
                    dataField: "comment",
                    required: true,
                    placeHolder: "Comment",
                    type: "text",
                    invalidFeedBack: "Veuillez renseigner ce champs"
                },
            ]
        }

        return attributesList;
    }

    const create = (formData) => {
        setFormData(formData)
        setLoading(true)

        formData.containerId = props.containerId;
        formData.businessType = businessType.split(':')[0]
        formData.typeId = businessType.split(':')[1]

        if(!formData.typeId) return

        identificationsService.createIdentification(formData, props.identifiedId, props.containerId).then(response => {
            const error = commons.isRequestError(response)
            if (error) {
                setLoading(false)
                let message = response.errorFamily + ' - ' + response.message
                toast.error(commons.toastError(response));
                setErrors([message])
            } else {
                setLoading(false)
                props.onCreateSuccess();
                toast(commons.toastSuccess("Un élément a été créé"));
            }
        })
    }

    const typeSelectionChange = (e) => {
        setBusinessType(e.target.value)
    }

    const typesSelect = () => {
        const options = types.map(type =>
            <option value={type.attributes.logicalPath +  ':' + type.attributes.id}>{type.attributes.displayName}</option>
        )

        return <Form.Control as="select" onChange={typeSelectionChange}>
            {options}
        </Form.Control>
    }

    if(!types) return <></>

    const form = {...formData}
    return <>
        <div className="container-create-root">
            <p className=" form-error">{errors}</p>
            <Form.Group className="field field-string attributes-list">
                <Form.Label>Type</Form.Label>
                {typesSelect()}
            </Form.Group>

            <AttributeListGroup
                attributesListConfig={attributesList()}
                data={form}
                standardFooterActions="true"
                formMode='create_object'/>
        </div>
    </>
}

export default AddIdentification;