import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { containerService } from '_services/container.services';
import { typeService } from '_services/type.services';
import TypeDetails from '_components/_admin/Types/TypeDetails/TypeDetails.js';

import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';

/**
 * Manage types
 */
class Types extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: '',
            loading: true,
            metaData: '',
            firstRender: true,
            selectedItemLink: null,
            dataRefreshed: false,
        }

        this.onCreateTypeSuccess = this.onCreateTypeSuccess.bind(this)
    }

    selectItem(itemId){
        this.setState({selectedItemLink: itemId})
    }

    componentDidMount(){
		containerService.getRootTypes(0, -1, true, this.props.containerId).then(json => {
			this.setState({
				items: json.data,
				metaData: json.metaData,
				//firstItem: json.data[0].links.details,
				selectedItemLink: json.data[0].attributes.id,
				loading: false
			})
		})
		.catch(error => {
			console.error(error);
			this.setState({loading: false})
		})
	}

	onCreateTypeSuccess(isRootType){
    	if(!isRootType){
			this.setState({needRefreshTree: true})
			setTimeout(() => this.setState({needRefreshTree: false}), 300)
		}
		else {
			this.setState({
				items:null,
				metaData: null,
				loading:true
			})
			this.componentDidMount()
		}
	}

    render() {

		let leftContent = <ReactTree
			containerId={this.props.containerId}
			needRefreshTree={this.state.needRefreshTree}
			rootItems={this.state.items}
			selectItem={(itemId) => this.selectItem(itemId)}/>

		let	rightContent = <TypeDetails
								{...this.props}
								firstItem={this.state.firstItem}
								onCreateTypeSuccess={this.onCreateTypeSuccess}
								itemId={this.state.selectedItemLink}/>

	   return <>
		   <div className="admin-middle-pane types-list">
			   	<div className={'left'}>
					<div className={'left-content'}>{leftContent}</div>
			   	</div>
              	<div className="type-details right">{rightContent}</div>
            </div>
	    </>
	  }
}

export default Types;


/**
 * Tree implementation for type manager
 */
class ReactTree extends React.Component {

	  static propTypes = {
	    keys: PropTypes.array,
	  }

	  constructor(props) {
	    super(props);
	    const keys = props.keys;

	    this.state = {
	      	defaultExpandedKeys: ['root_node'],
			expandedKeys: ['root_node'],
	      	defaultSelectedKeys: keys,
	      	defaultCheckedKeys: keys,
	      	treeData: [],
			currentNodeKey: null
	    };

	    this.refreshCurrentNode = this.refreshCurrentNode.bind(this)
	  }

	refreshCurrentNode () {
		return new Promise(resolve => {
			const treeData = [...this.state.treeData];
			const nodeKey = this.state.currentNodeKey

			this.getChildrenTreeData(treeData, nodeKey);
			resolve();
		});
	  }

	  onLoadData = treeNode => {
		treeNode.renderIcon()
	    return new Promise(resolve => {
			const treeData = [...this.state.treeData];
	        const nodeKey = treeNode.props.eventKey

	        this.getChildrenTreeData(treeData, nodeKey);
	        resolve();
	    });
	  }

	  getChildrenTreeData(treeData, curNodeKey) {
		   if(curNodeKey !== 'root_node') {
			  const loop = (data, newChildren) => {
			    data.map(item => {
			      if (curNodeKey === item.key) {
			          item.children = newChildren;
					  item.loading = false
			      }

			      if(item.children){
		    		loop(item.children, newChildren)
			      }
			    })
			  }

			  typeService.getSubtypeOf(curNodeKey, true, this.props.containerId).then(json => {
		        	let items = json.data
		        	if(items) {
		        		let children = []
			        	items.map(i => {
							children.push(
								{
									key: i.attributes.id,
									title: i.attributes.displayName,
									isLeaf: false,
									loading: true,
									icon: (props) => businessIcon(props)
								}
							)
						})

						loop(treeData, children);
		        		this.setState({ treeData});
		        	}
		        })
		   }
	  }

	  onSelect = info => {
		  if(info.length > 0 && info[0] !== 'root_node'){
			  if(this.props.selectItem){
				  this.props.selectItem(info[0])
				  this.setState({currentNodeKey: info[0]})
			  }
	  	  }
	  };

	  componentDidUpdate(prevProps, prevState, snapshot) {
	  	if(this.props.needRefreshTree && !prevProps.needRefreshTree){
			this.refreshCurrentNode()
		}

	  	if(this.props.rootItems && !prevProps.rootItems){
			  const treedata = generateRootTreeData(this.props.rootItems)
			  this.setState({treeData: treedata})
	  	}
	  }

	componentDidMount() {
	  	if(this.props.rootItems) {
			const treedata = generateRootTreeData(this.props.rootItems)
			this.setState({treeData: treedata})
		}
	}

	render() {
		const { treeData } = this.state;
		if(treeData && treeData.length >0){
			return (
				<Tree
					ref={this.setTreeRef}
					className="myCls"
					showLine
					defaultExpandParent
					checkStrictly
					showIcon
					defaultExpandedKeys={this.state.defaultExpandedKeys}
					defaultSelectedKeys={this.state.defaultSelectedKeys}
					defaultCheckedKeys={this.state.defaultCheckedKeys}
					onSelect={this.onSelect}
					onCheck={this.onCheck}
					loadData={this.onLoadData}
					treeData={treeData}>
				</Tree>
			);
		}

	   	return <></>
	  }
	}

const generateRootTreeData = (items) => {
	let treeData = []
	let children = []
	if(items){
		items.map(i => {
			children.push({key: i.attributes.id, title: i.attributes.displayName, isLeaf: false, icon: (props) => businessIcon(props)})
		})
	}

	treeData.push({key: 'root_node', title: 'Types métiers', isLeaf: false, children: children, icon: (props) => businessIcon(props)})
	return treeData
}

const businessIcon = (props) => {

	if(props.eventkey === 'root_node'){
		return <i className="fa fa-home fa-lg primary-icon-color"></i>
	}

	if(props.loading){
		return <i className="fa fa-spinner fa-lg primary-icon-color"></i>
	}

	return <span>
			<i className="fa fa-cubes fa-md primary-icon-color rc-tree-icon_loading"></i>
			{props.loading && <i className="fa fa-spinner fa-md primary-icon-color"></i>}
	</span>
}
