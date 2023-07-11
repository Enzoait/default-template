import React, { Component } from 'react';
import {lifecycleService} from "_services/lifecycle.services";
import {StatusHelper} from "_helpers/StatusHelper";

class LifecycleTransitions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.lifecycleId !== prevProps.lifecycleId && this.props.lifecycleId){
            lifecycleService.lifecycleTransitions(this.props.lifecycleId, this.props.containerId).then(response => {
            })
        }
    }

    componentDidMount() {
        lifecycleService.lifecycleTransitions(this.props.lifecycleId, this.props.containerId).then(response => {
            //console.log('res:  '+ JSON.stringify(response))
            this.setState({
                transitions: response && response.data ? response.data : []
            })
        })
    }

    getTransitions(){
        let transitions = [];
        if(this.state.transitions){
            this.state.transitions.map(transition => {
                let action = transition.attributes.action
                transitions.push(<div className={'lifecycle-transition-view'}>
                        <div className={'from-state'}>{StatusHelper.getDisplayForStatus(transition.attributes.fromState)}</div>
                        <div className={'action action_' + action}>{StatusHelper.getAction(action)}</div>
                        <div className={'arrow-right'}></div>
                        {this.getToStates(StatusHelper.getDisplayForStatus(transition.attributes.toState))}
                    </div>
                )
            })
        }
        return transitions;
    }

    getToStates(toState){
        let split = toState.split(";"), result = []
        split.map(text => {
            if(text) result.push(
                <div className={'to-state'}>
                    {StatusHelper.getDisplayForStatus(text)}
                </div>
            )
        })

        return result;
    }

    render() {
        return <div className={'lifecycle-pane'}>
            {this.props.lifecycleId && <>
                    <div className={'type-details-title'}><h1>{this.props.lifecycleName}</h1></div>
                    {this.getTransitions()}
                </>
            }

            {!this.props.lifecycleId && <>
                    <p>{'Pas de cycle de vie'}</p>
                </>
            }
        </div>
    }
}

export default LifecycleTransitions;
