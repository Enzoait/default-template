import React from "react";

function LoginFooter(props){

    return <>
        <div className={'footer-app-version login-page-footer'}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
            }}>
                <span>KATAPPULT © 2022.</span>
                <span>BY NEXITIA TECHNOLOGIES<br/></span>
            </div>
        </div>
    </>
}

export default LoginFooter;
