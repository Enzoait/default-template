import React, {Component} from 'react';
import {DataTable, WaitingPane} from '_components/_common';
import {businessRulesService} from "_services/business.rule.services";
import {Wizard} from "_components/_common";
import BusinessRuleAdd from "_components/_admin/BusinessRules/BusinessRuleAdd";

class BusinessRuleClasses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            metaData: '',
            loading: true,
            pageSize: 12
        }

        this.goToPage = this.goToPage.bind(this)
        this.onCreateSuccess = this.onCreateSuccess.bind(this)
    }

    componentDidMount() {
        this.loadDatas(0)
    }

    loadDatas(page) {
        businessRulesService.businessRuleClasses(page, this.state.pageSize, this.props.containerId)
            .then(json => {
                return json;
            }).then(
                json => {

                this.setState({
                    loading: false,
                    items: json.data,
                    metaData: json.metaData,
                    page: page
                })
        }).catch(error => {
            console.error(error);
            this.setState({loading: false,})
        });
    }

    goToPage(page) {
        this.loadDatas(page)
    }

    action(v, item) {
        return <td>
            <div className={'btn-toolbar'}>
                <Wizard hideFooter={true}
                        dialogSize="md"
                        buttonIcon="fa fa-sm fa-plus"
                        buttonTitle='Créer une règle à partir de cette classe'
                        dialogTitle='Ajouter une règle'
                        dialogContentProvider={(wizardCloseFunction) => this.newBusinessRuleWizardContent(wizardCloseFunction, item)}/>
            </div>
        </td>
    }

    onCreateSuccess(wizardCloseFunction) {
        wizardCloseFunction()
    }

    newBusinessRuleWizardContent(wizardCloseFunction, item) {
        return <BusinessRuleAdd
            baseRule={item}
            onCreateSucess={() => this.onCreateSuccess(wizardCloseFunction)} {...this.props}/>
    }

    name(v, i) {
        return <>
            <div className={'table-list-admin-root-list-div'}>
                <div style={{padding: '0rem 0 0.2rem 0'}}>
                    <p className={'table-link'}>{v.description}</p>
                    <div className={'table-list-admin-root-list-desc1'}>{v.beanName}</div>
                </div>
            </div>
        </>
    }

    render() {

        if (this.state.loading) {
            return <div className="portlet-content">
                <WaitingPane/>
            </div>
        }

        let items = this.state.items;
        const metaData = this.state.metaData;
        const tableConfig = {
            columnsConfig: [
                {name: 'Nom', dataField: 'attributes', displayComponent: (v, i) => this.name(v, i)},
                {dataField: 'attributes', displayComponent: (v, i) => this.action(v, i)}
            ],
        }

        return <>
            <div className={'header-btn-toolbar'}></div>
            <DataTable items={JSON.stringify(items)}
                       hover={true}
                       tableClassName="data-table"
                       pagination={true}
                       displayTotalElements={true}
                       goToPage={this.goToPage}
                       metaData={JSON.stringify(metaData)}
                       tableConfig={tableConfig}
            />
        </>
    }
}

export default BusinessRuleClasses;
