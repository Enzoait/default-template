import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import {commons} from '_helpers/commons'
import {DefaultFooter} from '_components/_common';

class PlatformContextMenu extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {

        let rows=[], viewName = commons.getValueFromUrl('name');
        this.props.menuContent.map(c => {
            let className ='fa fa-lg ' + c.className;
            let listGroupsItems = (
                <ListGroup.Item action active={viewName === c.key}
                                className="katappult-lgi-menu no-border"
                                onClick={e=>this.props.setDisplayedView(e, c.key, c.menuGroup)}>
                    <i className={className}></i>{c.name}
                </ListGroup.Item>
            );

            rows.push(listGroupsItems);
            if(c.dividerAfter) {
                rows.push(<div className="menu-divider">&nbsp;</div>)
            }
        })

        return <>
            <div className="secondary-context-menu fadeIn">
                <div lassName="menu">{rows}</div>

                <div className="">
                    <DefaultFooter {...this.props}/>
                </div>
            </div>
        </>
    }
}

export default PlatformContextMenu;
