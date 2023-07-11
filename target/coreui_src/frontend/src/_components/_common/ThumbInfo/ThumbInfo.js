import React, { Component } from 'react';

class ThumbInfo extends Component {

    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        let host = window.location.host;
        let pathname = window.location.pathname;
        let productId = this.props.productId ? this.props.productId.split('/').join('_') : 'no-img'
        let imageName = this.props.imageName ? this.props.imageName : 'main.jpg'
        let rootUrl;
        if(host.includes('localhost')){
            rootUrl = "http://localhost:8080/" + process.env.REACT_APP_CONTEXT_ROOT
        }
        else {
            rootUrl = `${'http://'  + host  + '/' + process.env.REACT_APP_CONTEXT_ROOT }`
        }

        return (
            <React.Fragment>
                <div id="cardimg-wrapper" className={this.props.className ? this.props.className : "card-image"}
                     style={{backgroundImage: `url(${rootUrl + '/' + productId + '/' + imageName})`}}>
                </div>
            </React.Fragment>
        )
    }
}

export default ThumbInfo;
