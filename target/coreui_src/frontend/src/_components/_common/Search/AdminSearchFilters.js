
import React from 'react';
import { Button,} from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '_actions/actions';

const mapStateToProps = store => ({
	headerSearchComp: store.headerSearchComp,
	searchCriterias: store.headerSearchComp.criterias,
})

const mapDispatchToProps = (disptach) => ({
	updateSearchResults: (e) => disptach(actions.updateHeaderSearchCompSearchTerm(e)),
})

class AdminSearchFilters extends React.Component {
	
	constructor(props){
		super(props);
		this.setState({
			loading:true
		})
	}
	
	updateSearchCriterias(selection){
		localStorage.setItem('adminSearchType', JSON.stringify(selection))
		let payload = {
			criterias: {
				adminSearchType: selection,
				searchType: localStorage.getItem('searchType')
			}
		}
		
		this.props.updateSearchResults(payload);
		this.setState({
			selection: selection
		})
	}

	render() {
		let each = [],
		searchType = JSON.parse(localStorage.getItem('adminSearchType'))
		
		if(searchType !== null && searchType !== undefined) {
			searchableTypes.map(t => {
				let isSelected = t.rootType === searchType.rootType
				let icon
				if(isSelected) {
					icon = <span className="badge badge-pill badge-warning">Current Selection</span>
				}
				
				if(t.visible === true){
					each.push( <>
						<div>
							<h4>{t.displayName}</h4>
							{icon}
						</div>
						<div>
							<div className="float-right">
								<Button onClick={e => this.updateSearchCriterias(t)} disabled={isSelected}>Set criteria</Button>
							</div>
						</div>
					</>)
				}
			})
			
			return each
		}
		else {
			return this.loading()
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps) (AdminSearchFilters);


const GetSearchType = (rootType) => {
	let res = null
	searchableTypes.map(e => {
		if(rootType === e.rootType){
			res = e
		}
	})
	return res !== null ? res : GetSearchType('com.katappult.people.Party/Person')
}

const  searchableTypes = [
        {
            displayName: 'Product',
            businessClass: 'com.katappult.core.shop.ProductInstance',
            rootType: 'com.katappult.product.ProductInstance',
            headerMessage: 'Search Products...',
            visible: true
        },
        {
            displayName: 'Order',
            businessClass: 'com.katappult.core.shop.Command',
            headerMessage: 'Search Orders...',
            visible: false
        },
        {
            displayName: 'People and Organization',
            businessClass: 'com.katappult.core.people.Party',
            rootType: 'com.katappult.people.Party',
            headerMessage: 'Search People...',
            visible: false
        },
    ]
