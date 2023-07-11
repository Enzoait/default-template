import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel
} from "react-accessible-accordion";
import {DataTable, EmptyPane} from "_components/_common";

function TypeDetailsBusinessRules(props) {

    const rulesCount = props.vetoableBusinessRulesItems ? props.vetoableBusinessRulesItems.length : 0;
    if(props.loading){
        return <></>
    }

    let tables = []
    if(props.datas && props.datas.length > 0) {
        let grouped = groupByEvent(props.datas)
        Object.keys(grouped).map(function (k, v) {
            let datas = grouped[k]
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
                    <DataTable items={JSON.stringify(datas)} tableConfig={vetoableTableConfig} paginate={false}/>
                </AccordionItemPanel>
            </AccordionItem>
            tables.push(table)
        });
    }
    else {
        return <EmptyPane />
    }

    return <Accordion allowMultipleExpanded allowZeroExpanded>
        {tables}
    </Accordion>
}

export default  TypeDetailsBusinessRules;

function groupByEvent(array){
    let group = array.reduce(function (r, a) {
        r[a.attributes.event] = r[a.attributes.event] || [];
        r[a.attributes.event].push(a);
        return r;
    }, Object.create(null));
    return group;
}

const tableCell = (value, size) => {
    return <td width={size}>
        {value}
    </td>
}

const vetoableTableConfig = {
    columnsConfig: [
        { dataField: 'attributes', displayComponent: (v, i) => vetoableIcon(v, i)},
        { name: 'Ordre', dataField: 'attributes.order', displayComponent: (v) => tableCell(v, '5%')},
        { name: 'Description',  dataField: 'attributes.description', displayComponent: (v) => tableCell(v, '50%')},
        { name: 'Règle', dataField: 'attributes.identifier', displayComponent: (v) => tableCell(v, '40%')},
    ],
}

const vetoableIcon = (v, i) => {
    let content;
    if(v.vetoable){
        content = <i className={'fa fa-flash fa-lg'}></i>
    }

    if(!v.vetoable && !v.transactionPhase){
        content = <i></i>
    }

    if(!v.vetoable && v.transactionPhase === 'AFTER_COMMIT'){
        content = <i className={'fa fa-lg fa-check'}></i>
    }

    if(!v.vetoable && v.transactionPhase === 'AFTER_ROLLBACK'){
        content = <i className={'fa fa-lg fa-reply'}></i>
    }

    return <div style={{margin: '0.5rem 0rem 0rem 0.5rem'}}>{content}</div>
}

