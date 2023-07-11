import React from 'react';
import PlatformContextMenu from './PlatformContextMenu.js'
import queryString from 'query-string';

function LeftMenu(props) {

    const queryUrlParams = queryString.parse(props.location.search);
    let platformSelected = queryUrlParams.tab === 'platform';

    return <div className="main-left-child-fixed ">
        {platformSelected  && <PlatformContextMenu {...props} menu={props.superAdministratorMenu}/>}
    </div>
}

export default LeftMenu;