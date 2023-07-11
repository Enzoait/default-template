import React, {Component} from 'react';
import {AttributeListGroup,} from '_components/_common';
import {Button, ButtonToolbar} from 'reactstrap';
import PropTypes from 'prop-types';
import {commons} from '_helpers/commons.js';
import {contactableService} from '_services/contactable.services';
import {toast} from 'react-toastify';
import Badge from 'react-bootstrap/Badge'
import moment from 'moment';

const propTypes = {
    businessId: PropTypes.string.isRequired,
};
const defaultProps = {
    businessId: ''
};

/**
 * Contactable component
 */
class Contactable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contacts: {},
            contactMecId: '',
            allContacts: []
        }

        this.updateWebContactsSuccess = this.updateWebContactsSuccess.bind(this)
        this.reloadContacts = this.reloadContacts.bind(this)
    }

    /**
     * Update the web contacts array
     */
    updateWebContacts(formData) {
        let form = "{\"webAddresses\":".concat(JSON.stringify(formData)).concat('}')
        contactableService
            .updateWebContacts(this.props.businessId,
                this.state.contactMecId,
                JSON.parse(form), this.props.containerId)
            .then(response => {
                this.updateWebContactsSuccess()
            })
            .catch(error => {
                toast.error('Error occurs updating web contacts')
                console.error(error)
            });
    }

    updateWebContactsSuccess() {
    }

    /**
     * Update telecom contacts array
     */
    updateTelecomContacts(formData) {
        let form = "{\"telecomAddresses\":".concat(JSON.stringify(formData)).concat('}')
        contactableService
            .updateTelecomContacts(this.props.businessId,
                this.state.contactMecId,
                JSON.parse(form), this.props.containerId)
            .then(response => {
                this.updateTelecomContactsSuccess()
            })
            .catch(error => {
                toast.error('Error occurs updating web contacts')
                console.error(error)
            });
    }

    updateTelecomContactsSuccess() {
    }

    /**
     * Update of postal address
     */
    updatePostalContact(formData) {
        return contactableService.updatePostalContacts(this.props.businessId, this.state.contactMecId, formData, this.props.containerId).then(response => {
                this.updatePostalContactSuccess()
                return true;
            }).catch(error => {
                toast.error('Error occurs updating web contacts')
                console.error(error)
                return false;
            });
    }

    updatePostalContactSuccess() {
        this.reloadContacts()
    }

    /**
     * Title of postal address section
     */
    postalAddressTitle = (data, config) => {
        let value = commons.getPropByString(data, 'label');
        return value;
    }

    async componentDidMount() {
        this.reloadContacts()
    }

    async reloadContacts() {
        contactableService.getAllContacts(this.props.businessId, this.props.containerId).then(response => {
            if (commons.isRequestSuccess(response) && response.data.length > 0) {
                const firstItem = response.data[0].attributes.lastModifiedDate;
                const secondItem = response.data.length > 1 ? response.data[1].attributes.lastModifiedDate : null;
                let finalItem =  response.data[0];

                if(secondItem) {
                    let firstItemLastModification = moment(firstItem, "YYYY-MM-DDD hh:mm:ss").toDate();
                    let secondItemLastModification = moment(secondItem, "YYYY-MM-DDD hh:mm:ss").toDate();
                    if(secondItemLastModification >= firstItemLastModification){
                        finalItem =  response.data[1];
                    }
                }

                this.setState({
                    metaData: response.metaData,
                    contactMecIndex: 0,
                    contacts: finalItem,
                    contactMecId: finalItem.attributes.id,
                    allContacts: response.data
                })
            } else {
                this.setState({
                    metaData: undefined,
                    contacts: undefined,
                    contactMecId: undefined
                })
            }
        })
    }

    fullContactView() {
        /**
         * Attributes list configuration
         * objectarray
         * stringarray
         */
        const webAttributesList = {
            formId: 'webAttributesList_form',
            onSubmit: (formData) => this.updateWebContacts(formData),
            borderLess: true,
            attributes: [
                {
                    title: 'Email et réseaux sociaux',
                    type: 'editableLabelObjectarray',
                    dataField: 'webAddress',
                    items: {
                        attributes: [
                            {name: 'Titre', dataField: 'title', type: 'text'},
                            {name: 'Valeur', dataField: 'webAddress', type: 'text'},
                        ]
                    },
                },
            ],
        };

        /**
         * Attributes list configuration
         * objectarray
         * stringarray
         */
        const phonesAttributesList = {
            formId: 'phonesAttributesList_form',
            onSubmit: (formData) => this.updateTelecomContacts(formData),
            borderLess: true,
            attributes: [
                {
                    title: 'Coordonnées Téléphoniques',
                    type: 'editableLabelObjectarray',
                    dataField: 'telecomAddress',
                    items: {
                        attributes: [
                            {name: "Titre", type: 'text', dataField: 'title'},
                            {name: "Code pays", type: 'text', dataField: 'countryCode'},
                            {name: "Numéro", type: 'tel', dataField: 'telecomNumber'},
                        ],
                    },
                },
            ],
        };

        const postalAddressAttributesList = {
            arrayTitleProvider: (data) => this.postalAddressTitle(data, this),
            onSubmit: (formData) => this.updatePostalContact(formData),
            attributes: [
                {name: 'Rue', dataField: 'address1', type: 'text'},
                {name: '(Rue 1)', dataField: 'address2', type: 'text'},
                {name: '(Rue 2)', dataField: 'address3', type: 'text'},
                {name: 'Code postale', dataField: 'postalCode', type: 'text'},
                {name: 'Ville', dataField: 'city', type: 'text'},
                {name: 'Pays', dataField: 'country', type: 'text'},
            ],
        }

        if (this.state.contacts && this.state.contacts.attributes) {

            let additionalAttributesDisplay
            if (this.props.additionalAttributesDisplay) {
                additionalAttributesDisplay = this.props.additionalAttributesDisplay(this.state.contacts.links, this.state.contacts.attributes.id)
            }

            const postalAddress = {attributes: this.state.contacts.attributes.postalAddress}
            return (
                <React.Fragment>
                    <div>
                        {additionalAttributesDisplay}
                        <AttributeListGroup {...this.props}
                                            attributesListConfig={postalAddressAttributesList}
                                            data={postalAddress}
                                            displayHeader='true'
                                            canEdit={this.props.canEdit}
                                            standardFooterActions="true"
                                            newObjectFormData={newPostalAddressFormData}/>

                        {this.props.hideMobileContacts !== true && <AttributeListGroup {...this.props}
                                                                                       attributesListConfig={webAttributesList}
                                                                                       data={this.state.contacts.attributes}
                                                                                       canEdit={this.props.canEdit}
                                                                                       firstRowLabel='false'
                                                                                       newObjectFormData={newWebFormData}/>
                        }

                        {this.props.hideMobileContacts !== true && <AttributeListGroup {...this.props}
                                                                                       attributesListConfig={phonesAttributesList}
                                                                                       data={this.state.contacts.attributes}
                                                                                       firstRowLabel='true'
                                                                                       canEdit={this.props.canEdit}
                                                                                       newObjectFormData={newPhoneFormData}/>
                        }
                    </div>
                </React.Fragment>
            )
        }
        if (this.props.emptyContacts) {
            return <div>
                {this.props.emptyContacts()}
            </div>
        }
        return <></>
    }

    summaryContactView() {
        if (this.state.contacts && this.state.contacts.attributes) {
            let postal = this.state.contacts.attributes.postalAddress;

            let additionalAttributesDisplay
            if (this.props.additionalAttributesDisplay) {
                additionalAttributesDisplay = this.props.additionalAttributesDisplay(this.state.contacts.links, this.state.contacts.attributes.id)
            }

            return <div>
                {additionalAttributesDisplay}
                <p><span>{postal.address1} </span> <span>{postal.address2} </span></p>
                <p><span>{postal.postalCode}, </span> <span>{postal.city}. </span></p>
                <p><span>{postal.country}</span></p>
            </div>
        }
        if (this.props.emptyContacts) {
            return <div>
                {this.props.emptyContacts()}
            </div>
        }

        return <></>
    }

    async selectNextContactMecView(e) {
        if (e) e.preventDefault();
        let index = this.state.contactMecIndex + 1;
        if (index >= this.state.allContacts.length) {
            index = 0;
        }

        let contact = this.state.allContacts[index];
        this.setState({
            contactMecIndex: index,
            contacts: contact,
            contactMecId: contact.attributes.id,
        })
    }

    render() {
        if (this.props.viewMode === 'summary') {
            return this.summaryContactView()
        } else {

            let badge = <>&nbsp;&nbsp;&nbsp;</>;
            if (this.state.allContacts.length > 0) {
                badge = <Badge pill variant="warning">{this.state.allContacts.length}</Badge>
            }

            return <>
                <div>
                    {this.state.allContacts.length > 1 && this.props.canSwitch &&
                    <ButtonToolbar className="justify-content-start mb-4">
                        <Button onClick={e => this.selectNextContactMecView(e)}>
                            {badge}&nbsp;SUIVANT &nbsp;
                            <i className="fa fa-angle-right fa-lg"></i>
                        </Button>
                    </ButtonToolbar>
                    }
                </div>
                <div>
                    {this.fullContactView()}
                </div>
            </>
        }
    }
}


const newWebFormData = {
    'label': '', 'value': ''
}
const newPhoneFormData = {
    'label': '', 'number': '', 'country': ''
}
const newPostalAddressFormData = {
    'id': '', 'label': 'New postal address', 'street': '', 'code': '', 'county': ''
}

const postalAddressUIConfig = {
    'role': {
        'enumKey': 'contactMechanismRole',
        'ui:widget': 'select'
    },
    'country': {
        'enumLoader': 'loadCountries()',
        'ui:widget': 'select'
    }
}


Contactable.propTypes = propTypes;
Contactable.defaultProps = defaultProps;


export default Contactable;
