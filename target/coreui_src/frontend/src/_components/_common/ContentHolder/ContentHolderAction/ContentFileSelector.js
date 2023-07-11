import React, {Component} from 'react'
import {Button} from 'reactstrap'

class ContentFileSelector extends Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.refs.fileUploader.click()
    }

    render() {
        return (<>
            <Button onClick={this.handleClick}
                    hidden={this.props.hidden}>
                <i className="fa fa-upload fa-md"></i>
                &nbsp;{this.props.uploadLabel}
            </Button>

            <input type="file" id="file" style={{display: 'none'}}
                   accept={this.props.accept}
                   ref='fileUploader' onChange={this.props.onChangeFile}/>
        </>)
    }
}

export default ContentFileSelector
