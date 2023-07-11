import React from "react";

function HeaderVersion(props){

    let buildVersion = process.env.REACT_APP_BUILD_VERSION;
    if(!buildVersion){
        buildVersion = process.env.REACT_APP_VERSION
    }

    buildVersion = 'V' + buildVersion;

    const name = props.userContext.applicationFriendlyName ? props.userContext.applicationFriendlyName : ''
    const env = props.userContext.applicationCurrentEnvironmentName ? props.userContext.applicationCurrentEnvironmentName : ''

    if(env === 'prod'){
        return <></>
    }

    return <>
        <div className={'header-version-name'}>
            {name} {env.toUpperCase()} {buildVersion}
        </div>
    </>
}

export  default HeaderVersion;
