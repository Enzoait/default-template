import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {contentHolderService} from '_services/contentHolder.services';

const propTypes = {
    contentHolderId: PropTypes.string.isRequired
}

const defaultProps = {}

/**
 * Displays Attachments content infos
 */
class ContentHolderAttachmentsInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            attachments: [],
        }
    }

    componentDidMount() {
        let contentHolderId = this.props.contentHolderId
        contentHolderService.contentInfos(contentHolderId, 'attachements', this.props.containerId)
            .then(ci => {
            })
    }

    render() {
        let header = (
            <label className="katappult-form-title-level-1">Attachements</label>
        )

        if (this.state.attachments.length === 0) {
            return (
                <React.Fragment>
                    <div>
                        {header}
                        <strong>Pas de contenu</strong>
                    </div>
                </React.Fragment>
            )
        }
    }
}

ContentHolderAttachmentsInfo.propTypes = propTypes;
ContentHolderAttachmentsInfo.defaultProps = defaultProps;

export default ContentHolderAttachmentsInfo;
