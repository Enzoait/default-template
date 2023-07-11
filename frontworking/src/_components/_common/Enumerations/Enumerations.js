import React, { Component } from 'react';
import { connect } from 'react-redux';
import { listValuesService } from '_services/listvalues.services';
import {ListGroup, ListGroupItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import { DataTable, EmptyPane} from '_components/_common';
import * as actions from '_actions/actions';

const mapStateToProps = store => ({
	selectedItem: store.enumerations,
})
const mapDispatchToProps = (disptach) => ({
	updateEnumerationsSelection: (e) => disptach(actions.updateEnumerationsSelection(e)),
})
class Enumerations extends Component {

	constructor(props){
		super(props)
		this.state = {
			names :[],
			selectedItem: this.props.selectedItem ? this.props.selectedItem : null,
			'en': this.props.selectedItem.fr ? this.props.selectedItem.en : [],
			'fr': this.props.selectedItem.en ? this.props.selectedItem.fr : [],
		}
		this.selectItem = this.selectItem.bind(this)
	}

	componentDidMount() {
		listValuesService.names(this.props.containerId)
		.then(names => {
			if(names && names.data){
				this.setState({
					names: names.data
				})
			}
		})
	}
	 selectItem(e, item){
        e.preventDefault();
        //const cursel = this.state.selectedItem;
        let source = e.target || e.srcElement;
        //if(cursel) cursel.activate = false;
        source.activate = true;

		let formData  = new FormData()
        formData['name'] = item

        if(source !== this.state.selectedItem) {
	        listValuesService.noLocale(formData, this.props.containerId)
			.then(names => {
				let en = [], fr = []
				names.data.map(i => {
					if(i.attributes.locale === 'en'){
						en.push(i)
					}
					else {
						fr.push(i)
					}
				})

				let payload = []
				payload.push(en)
				payload.push(fr)

				this.props.updateEnumerationsSelection(payload)
				this.setState({
					selectedItem: source,
					'en': en,
					'fr': fr,
				})
			})
        }
	 }

	 render() {
		 const navs = [];
         this.state.names.map((item) => {
             navs.push(
                 <ListGroupItem tag="a" href="#" onClick={(e) => this.selectItem(e, item)} action>
                         {item}<i className="fa fa-angle-right icons font-lg float-right"></i>
                 </ListGroupItem>
             );
         });

         if(this.state.names.length === 0){
        	 navs.push(<EmptyPane />)
         }

         let en, fr, noSelection, hasEnum = false
         if(this.state.en && this.state.en.length > 0){
        	hasEnum = true
        	en = (
        		<div className="no-radius">
        			<div className=""><h3 className="">English</h3></div>
	        		<DataTable items={JSON.stringify(this.state.en)}
	        			totalElements='2'
	        			paginate={false}
						tableConfig={tableConfig}/>
	            </div>
        	)
         }

         if(this.state.fr && this.state.fr.length > 0){
        	 hasEnum = true
        	 fr = (
        		<div>
        				<div className=""><h3 className="">Français</h3></div>
        			 	<DataTable items={JSON.stringify(this.state.fr)}
							totalElements='2'
							paginate={false}
							tableConfig={tableConfig}/>
        		</div>
        	 )
         }

         if(!hasEnum){
	         noSelection  = <EmptyPane mainMessage="No item selected" secondaryMessage="Please select an item"/>
         }

         return (<div className={'enumerations'}>
			 <div className="admin-middle-pane types-list">
				 <div className={'bordered-panel left'}><ListGroup>{navs}</ListGroup></div>
				 <div className="type-details right">
			 			<div>{noSelection}</div>
	 					<div>{fr}</div>
					 <div>{en}</div>
				 </div>
			 </div>
     		</div>)
	  }
}

const tableConfig = {
		columnsConfig: [
			{ name: 'Affiché',  displayComponent: (v, i) => LinkTo(v, i)},
			{ name: 'Valeur', dataField: 'attributes.savedValue', },
		    { name: 'Nom', dataField: 'attributes.name' },
		    { name: 'Locale', dataField: 'attributes.locale'},
		    { displayComponent: (v, i) => angleRight(i)},
		],
}
/**
 * Generates an angle right icon
 */
const angleRight = (v, item) => {
	const link = `/admin/p/enumerations/${v.attributes.id}`
	return <td><Link to={link}><i className="fa fa-angle-right fa-lg"></i></Link></td>
}

/**
 * Generates an angle right icon
 */
const LinkTo = (v, i) => {
	const link = `/admin/p/enumerations/${i.attributes.id}`
	return <td><Link to={link}>{i.attributes.value}</Link></td>
}


export default connect(mapStateToProps, mapDispatchToProps) (Enumerations)
