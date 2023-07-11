import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import ContentHolderPrimaryInfo from './ContentHolderPrimaryInfo.js';
import ContentHolderAttachmentsInfo from './ContentHolderAttachmentsInfo.js'

const propTypes = {
    contentHolderId: PropTypes.string.isRequired
}

const defaultProps = {}

/**
 * Displays primary/attachments content infos
 */
class ContentHolderInfo extends Component {

    render() {

        return (
            <React.Fragment>
                <div className="spacer-20"></div>
                <Row>
                    <Col>
                        <h3><label className="form-title-level-0">Contenu</label></h3>
                    </Col>
                </Row>
                <table width="100%">
                    <tr className="noBorder">
                        <td>
                            <ContentHolderPrimaryInfo contentHolderId={this.props.contentHolderId}
                                                      canUpload={this.props.canUpload}/>
                        </td>
                    </tr>
                    <tr className="noBorder">
                        <td>
                            <div className="spacer-10">&nbsp;</div>
                        </td>
                    </tr>
                    <tr className="noBorder">
                        <td>
                            <ContentHolderAttachmentsInfo contentHolderId={this.props.contentHolderId}
                                                          canUpload={this.props.canUpload}/>
                        </td>
                    </tr>
                </table>
                <div className="spacer-10"></div>
            </React.Fragment>
        )
    }
}

ContentHolderInfo.propTypes = propTypes;
ContentHolderInfo.defaultProps = defaultProps;

export default ContentHolderInfo;
