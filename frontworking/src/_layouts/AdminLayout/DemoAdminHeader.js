import React from 'react';
import {Nav} from "react-bootstrap";

function DemoAdminHeader(props){

    const selectMenuPlatformAdmin = () => {
        props.history.push('/admin?tab=platform&v=businessRules')
    }

    const selectDemo = () => {
        props.history.push('/admin?tab=home&v=_FIRST_ITEM_')
    }

    return <>
        <div className={'admin-header-links admin-header-links-left'}>
            <Nav.Link href="#/admin?tab=platform" onClick={() => selectMenuPlatformAdmin('platformAdministration')} className={props.platformAdminSelected ? 'admin-header-link header-menu-active' : 'admin-header-link'}>
                <span>{props.userContext.workingContainer.name}</span>
            </Nav.Link>

            <Nav.Link onClick={() => selectDemo()} className={!props.platformAdminSelected ? 'admin-header-link admin-header-link-user header-menu-active' : 'admin-header-link admin-header-link-user'}>
                <span>DEMO TAB</span>
            </Nav.Link>
        </div>
    </>
}

export default DemoAdminHeader;
