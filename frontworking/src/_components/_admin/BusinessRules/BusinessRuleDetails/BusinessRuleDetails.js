import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import * as actions from '_reducers/actions';
import {businessRulesService} from '_services/business.rule.services';
import {commons} from '_helpers/commons';
import {AttributeListGroup, PersistenceInfo, WaitingPane} from '_components/_common';
import UpdateOrder from './UpdateOrder.js';
import queryString from 'query-string';
import {AllExlusionsView} from "_components/_admin/BusinessRules/Exclusions";
import {toast} from "react-toastify";

const mapStateToProps = store => ({
    applicationConfig: store.applicationConfig,
});
const mapDispatchToProps = (disptach) => ({
    updateApplicationConfigRX: (e) => disptach(actions.updateApplicationConfig(e)),
})


/**
 * Business rule details page
 */
class BusinessRuleDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: {},
            loading: true,
            businessRuleId: this.getRootObjectForDetailsId(),
            errors: [],
            viewMode: 'exclusions'
        }

        this.activate = this.activate.bind(this)
        this.deactivate = this.deactivate.bind(this)
        this.deleteRule = this.deleteRule.bind(this)
        this.onUpdateSuccess = this.onUpdateSuccess.bind(this)
        this.getRootObjectForDetailsId = this.getRootObjectForDetailsId.bind(this)
        this.showView = this.showView.bind(this)
    }

    showView(view) {
        this.setState({viewMode: view})
    }


    deleteRule() {
        businessRulesService.deleteRule(this.getRootObjectForDetailsId()).then(response => {
            if (this.props.displayListView) {
                this.props.popBreadCrumb(0);
                this.props.displayListView(true);
            }
        })
    }

    activate(e) {
        if (e) e.preventDefault()
        const businessRuleId = this.getRootObjectForDetailsId()
        const d = businessRulesService.activate(businessRuleId, this.props.containerId).then(response => {
            if(commons.isRequestError(response)){
                toast.error(commons.toastError(response));
            }
            else {
                this.onUpdateSuccess();
            }
        })
    }

    deactivate(e) {
        if (e) e.preventDefault()
        const businessRuleId = this.getRootObjectForDetailsId()
        const d = businessRulesService.desactivate(businessRuleId, this.props.containerId).then(response => {
            if(commons.isRequestError(response)){
                toast.error(commons.toastError(response));
            }
            else {
                this.onUpdateSuccess();
            }
        })
    }

    onUpdateSuccess(reloadListView) {
        this.loadData(this.getRootObjectForDetailsId(), false);
        if (reloadListView) {
            this.props.refreshListView();
        }
    }

    headerActions() {
        let canDoAction = true;
        if (canDoAction === true) {
            return (
                <div className={'btn-toolbar btn-toolbar-right'}>
                    <Button hidden={this.state.viewMode === 'exclusions'}
                            onClick={() => this.showView('exclusions')}>Exclusions</Button>
                    <Button hidden={this.state.viewMode === 'details'}
                            onClick={() => this.showView('details')}>Details</Button>
                    <Button hidden={this.state.item.data.attributes.active}
                            onClick={() => this.activate()}>ACTIVER</Button>
                    <Button hidden={!this.state.item.data.attributes.active}
                            onClick={() => this.deactivate()}>DÉSACTIVER</Button>
                    <UpdateOrder
                        {...this.props}
                        businessRuleId={this.getRootObjectForDetailsId()}
                        onUpdateSuccess={this.onUpdateSuccess}
                        oldOrder={this.state.item.data.attributes.order}/>
                </div>
            )
        }

        return <div></div>
    }

    componentDidMount() {
        this.loadData(this.getRootObjectForDetailsId(), false)
    }

    componentDidUpdate(prevProps, prevtstate) {
        const prevQueryUrlParams = queryString.parse(prevProps.location.search);
        const queryUrlParams = queryString.parse(this.props.location.search);
        let rootId = queryUrlParams.rootId;
        let prevId = prevQueryUrlParams.rootId;
        if (prevId !== rootId && rootId) {
            this.loadData(rootId)
        }
    }

    loadData(businessRuleId, updateBread) {

        this.setState({
            loading: true,
            item: null,
        })

        if (businessRuleId) {
            const d = businessRulesService.getById(businessRuleId, this.props.containerId).then(json => {

                let location = json && json.data ? json.data.attributes.rule : '';
                if (updateBread && this.props.pushBreadCrumb) {
                    let item = {'href': '#', title: location}
                    this.props.pushBreadCrumb(item)
                }

                this.props.updateApplicationConfigRX(location);
                this.setState({
                    item: json,
                    loading: false
                });

            }).catch(error => {
                console.error(error);
            })
        }
    }

    getRootObjectForDetailsId() {
        const queryUrlParams = queryString.parse(this.props.location.search);
        let objectforDetailsId = queryUrlParams.rootId;
        return objectforDetailsId
    }

    workingContainer(v) {
        return <td>
            {commons.getWorkingContainerName(this.props.userContext)}
        </td>
    }

    render() {

        if (this.state.loading || !this.state.item) {
            return <WaitingPane/>
        }

        const attributesList = {
            attributes: [
                {name: 'Nom', dataField: 'attributes.identifier'},
                {name: 'Description', dataField: 'attributes.description'},
                {name: 'Evènement déclencheur', dataField: 'attributes.event'},
                {name: 'Entité', dataField: 'attributes.businessClass'},
                {name: 'Applicable sur le type métier', dataField: 'attributes.businessType'},
                {name: 'Règle', dataField: 'attributes.rule'},
                {name: 'Ordre', dataField: 'attributes.order'},
                {name: 'Phase', dataField: 'attributes.transactionPhase'},
                {name: 'Vetoable', dataField: 'attributes.vetoable', type: 'bool'},
                {name: 'Active', dataField: 'attributes.active', type: 'bool'},
                {name: 'Conteneur', dataField: 'attributes', displayComponent: (v, i) => this.workingContainer(v, i)},
            ]
        };

        let content;
        const data = this.state.item.data;
        const d = commons.toJSONObject(data);
        if (this.state.viewMode === 'exclusions') {
            content = <AllExlusionsView {...this.props} businessRuleId={this.state.item.data.attributes.id}/>
        } else {
            content = <>
                <div className="">
                    <p className=" form-error">{this.state.errors}</p>
                    <AttributeListGroup
                        attributesListConfig={attributesList}
                        data={d}
                        displayHeader={true}
                        addHeaderMargin="true"/>
                </div>

                <div className="">
                    <p className=" form-error">{this.state.errors}</p>
                    <PersistenceInfo
                        {...this.props} data={d}
                        displayHeader={true}
                        addHeaderMargin="true"/>
                </div>
            </>
        }

        return <div className={'business-rules-details'}>
            <div className={'business-rules-details'}>
                <div className="admin-details-header">
                    <p className="page-title">{d.attributes.identifier}</p>
                    {this.headerActions()}
                </div>
                {content}
            </div>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessRuleDetails);
