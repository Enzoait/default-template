import React from "react";

class Footer extends React.Component{

    render(){
        let buildVersion = process.env.REACT_APP_BUILD_VERSION;
        if(!buildVersion){
            buildVersion = process.env.REACT_APP_VERSION;
        }

        return <div className={this.props.className ? this.props.className : this.props.className + " main-footer-legal-links"}>
            <ul>
                <li className="horizontal-list-item">Designed and developed by <a href="https://www.nexitia.com">NEXITIA TECHNOLOGIES</a></li>
                <li className="horizontal-list-item">MADE WITH KATAPPULT&copy; 2023 Version: {buildVersion}</li>
            </ul>
        </div>
    }
}

export default Footer;
