import React from 'react';
import {Nav} from "react-bootstrap";
import {
    RiLogoutBoxLine,
    RiSettings2Fill,
    RiShareCircleLine, RiUser2Line, RiUser4Fill, RiUser6Line,
} from "react-icons/ri";
import {commons} from "_helpers/commons";
import {coreUri} from "_helpers/CoreUri";

function AdminHeaderRight(props){

    const currentConnectedUser = () => {
        if(!commons.isLoggedInAsUser(props.userContext)){
            return <></>
        }

        let firstName = props.userContext.userDetails.firstName;
        if(firstName){
            return firstName + ' ' + props.userContext.userDetails.lastName;
        }

        return props.userContext.userDetails.addressageName;
    }

    const logout = () => {
        commons.katappult_core_logout();
    }

    let tab = commons.getValueFromUrl("tab");
    let platformAdminSelected = !tab || tab === 'platform';
    const frontendUri = process.env.REACT_APP_CLIENT_ROOT_URL.length > 2
        ? process.env.REACT_APP_CLIENT_ROOT_URL
        : '/';

    const loginUrl = coreUri.clientSideRenderedURL('/login');

    return <div className="admin-header-links admin-header-links-right">
        <Nav.Link href={coreUri.clientSideRenderedURL('/view?tab=platform&name=types')}
                  className={`admin-header-link nav-link admin-header-link${platformAdminSelected ? '-active' : '-notactive'}`}>
            <RiSettings2Fill size="2em"/>
            <span>Platform</span>
        </Nav.Link>

        <Nav.Link href={frontendUri} className="admin-header-link nav-link">
            <RiShareCircleLine size="2em"/>
            <span>{'Accueil'}</span>
        </Nav.Link>

        <div className={'current-connected-user'}>
            <RiUser6Line size="1.6em"/>
            {currentConnectedUser()}
        </div>
        <a href={loginUrl} className="admin-header-link nav-link" onClick={logout}>
            <RiLogoutBoxLine size="2em"/>
            <span>{'Logout'}</span>
        </a>
    </div>
}

export default AdminHeaderRight;