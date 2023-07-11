import React, {Component} from "react";
import {Input} from "reactstrap";
import {businessRulesService} from "_services/business.rule.services";
import {Link} from "react-router-dom";
import {DataTable, EmptyPane, WaitingPane} from "_components/_common";
import {coreUri} from "_helpers/CoreUri";
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import * as actions from "_actions/actions";
import {connect} from "react-redux";

const mapStateToProps = store => ({
    searchBusinessRulesRX: store.searchBusinessRules,
})

const mapDispatchToProps = (disptach) => ({
    updateSearchCriterias: (e) => disptach(actions.updateBusinessRulesSearchCriterias(e)),
})

class BusinessRulesFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingRules: false
        }

        this.rulesDatatable = this.rulesDatatable.bind(this)
    }

    componentDidMount() {
        businessRulesService.selectableEntities(this.props.containerId).then(response => {
            this.setState({
                selectableEntities: response.metaData.selectableEntities
            })
        })
    }

    onTypeChange(item) {
        this.setState({loadingRules: true})
        const businessClass = this.props.searchBusinessRulesRX.businessClass
        businessRulesService.applicableRulesOnBusinessClass(businessClass, item, this.props.containerId).then(response => {
            const searchBusinessRulesRX = {...this.props.searchBusinessRulesRX}
            searchBusinessRulesRX.businessType = item
            searchBusinessRulesRX.rules = response.data
            this.props.updateSearchCriterias(searchBusinessRulesRX)

            this.setState({
                loadingRules: false
            })
        })
    }

    businessTypeSelect() {
        let typesOptions = [];
        typesOptions.push(<option value=''>Selectionnez un type...</option>);

        const types = this.props.searchBusinessRulesRX.types
        if (types) {
            types.map(item => {
                let key = item.attributes.id
                typesOptions.push(<option value={key}>{item.attributes.displayName}</option>);
            });
        }

        let selectTypes = (
            <Input value={this.props.searchBusinessRulesRX.businessType} style={SelectStyle}
                   type="select" name="business-event" id="business-event"
                   onChange={(e) => this.onTypeChange(e.target.value)}>
                {typesOptions}
            </Input>
        )

        return selectTypes;
    }

    onSelectableEntitiesChange(value) {
        businessRulesService.allTypesOfBusinessClass(value, this.props.containerId).then(types => {

            businessRulesService.applicableRulesOnBusinessClass(value, '', this.props.containerId).then(rules => {
                const searchBusinessRulesRX = {...this.props.searchBusinessRulesRX}
                searchBusinessRulesRX.types = types.data
                searchBusinessRulesRX.businessClass = value
                searchBusinessRulesRX.rules = rules.data
                searchBusinessRulesRX.businessType = ''
                this.props.updateSearchCriterias(searchBusinessRulesRX)
            }).catch(() => {
                const searchBusinessRulesRX = {...this.props.searchBusinessRulesRX}
                searchBusinessRulesRX.businessClass = value
                searchBusinessRulesRX.rules = []
                searchBusinessRulesRX.types = types.data
                searchBusinessRulesRX.businessType = ''
            })
        })
    }

    selectableEntitiesSelect() {
        let subtypesOptions = [];
        subtypesOptions.push(<option value=''>Selectionnez une entité...</option>);

        if (this.state.selectableEntities) {
            this.state.selectableEntities.map(item => {
                let split = item.split('.');
                subtypesOptions.push(<option value={item}>{split[split.length - 1]}</option>);
            });
        }

        let selectableEntities = (
            <Input value={this.props.searchBusinessRulesRX.businessClass}
                   type="select" name="business-class" id="business-class"
                   onChange={(e) => this.onSelectableEntitiesChange(e.target.value)}>
                {subtypesOptions}
            </Input>
        )

        return selectableEntities;
    }

    selectRule(e, id) {
        if (e) e.preventDefault()
        const url = coreUri.backOfficeViewURL("platform", "businessRules", ["rootId=" + id]);
        this.props.history.push(url)
    }

    name(v, i) {
        let className = v.businessClass.split('.').pop()
        return <>
            <div className={'table-list-admin-root-list-div'}>
                <Link className={'table-link'} onClick={e => this.selectRule(e, i.attributes.id)}>
                    {className} - {v.description}
                </Link>
                <div style={{padding: '0rem 0 0.2rem 0'}}>
                    <div className={'table-list-admin-root-list-desc1'}>{v.identifier}</div>
                </div>
            </div>
        </>
    }

    icon(v, i) {
        return <td width={'5%'}>
            <div className={'table-list-admin-root-list-desc2'}>{vetoableIcon(i)}</div>
        </td>
    }

    order(v, item) {
        return <td width={'5%'}>
            {item.attributes.order}
        </td>
    }

    rulesDatatable() {
        if (this.state.loadingRules) {
            return <WaitingPane/>
        }

        const rules = this.props.searchBusinessRulesRX.rules;
        if (rules && rules.length > 0) {
            const tableConfig = {
                columnsConfig: [
                    {name: 'Identification', dataField: 'attributes', displayComponent: (v, i) => this.name(v, i)},
                    {displayComponent: (v, i) => this.icon(v, i)},
                    {displayComponent: (v, i) => this.order(v, i)},
                    {displayComponent: (v, i) => this.goDetails(v, i)},
                ],
            }

            let tables = []
            let groupedRules = groupByEvent(rules);
            Object.keys(groupedRules).map(function (k, v) {
                let datas = groupedRules[k]
                let table = <AccordionItem>
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            <div style={{
                                'display': 'flex',
                                'justify-content': 'space-between',
                                'margin-top': '-21px',
                                'margin-left': '3rem',
                                'margin-right': '2rem'
                            }}>
                                <div style={{
                                    paddingTop:'6px'
                                }}>{k}</div>
                                <div className={'accordion-rules-index'}>{datas.length}</div>
                            </div>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <DataTable items={JSON.stringify(datas)}
                                   tableClassName="data-table"
                                   tableConfig={tableConfig}
                                   paginate={false}/>
                    </AccordionItemPanel>
                </AccordionItem>
                tables.push(table)
            });

            return <Accordion allowMultipleExpanded allowZeroExpanded>
                {tables}
            </Accordion>
        }

        return <div><EmptyPane/></div>
    }

    goDetails(item, i) {
        const id = i.attributes.id
        return <td width={'5%'}>
            <Link onClick={e => this.selectRule(e, id)} style={{padding: '0.8rem'}}>
                <i className={'fa fa-chevron-right fa-lg'}></i>
            </Link>
        </td>
    }

    render() {
        return <>
            <div className="admin-filters-root">
                {this.props.toolbar}
                <div style={RootStyle}>
                    {this.selectableEntitiesSelect()}
                    {this.businessTypeSelect()}
                </div>
            </div>

            <div className="portlet-content">
                <div className={'table-list-admin-root-list'}>
                    {this.rulesDatatable()}
                </div>
            </div>
        </>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessRulesFilter);

const RootStyle = {
    display: 'flex',
    marginTop: '1rem'
}

const SelectStyle = {
    marginLeft: '1rem'
}

const vetoableIcon = (rule) => {
    let content;
    if (rule.attributes.vetoable) {
        content = <i className={'fa fa-flash fa-lg'}></i>
    }

    if (!rule.attributes.vetoable && !rule.attributes.transactionPhase) {
        content = <i></i>
    }

    if (!rule.attributes.vetoable && rule.attributes.transactionPhase === 'AFTER_COMMIT') {
        content = <i className={'fa fa-lg fa-check'}></i>
    }

    if (!rule.attributes.vetoable && rule.attributes.transactionPhase === 'AFTER_ROLLBACK') {
        content = <i className={'fa fa-lg fa-reply'}></i>
    }

    return <div style={{margin: '0.5rem 0rem 0rem 0.5rem'}}>{content}</div>
}

function groupByEvent(array) {
    let group = array.reduce((r, a) => {
        r[a.attributes.event] = [...r[a.attributes.event] || [], a];
        return r;
    }, {});
    return group;
}
