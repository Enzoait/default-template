import React from 'react';
import { Breadcrumb} from 'react-bootstrap';
import { AiOutlineCaretRight } from "react-icons/ai";

class AppBreadcrumb extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			items: []
		}

		this.pushItem = this.pushItem.bind(this);
		this._dopopBreadCrumb=this._dopopBreadCrumb.bind(this);
	}
	getHomeLabel(){
		if(this.props.homeLabel){
			return this.props.homeLabel;
		}

		return 'Home';
	}
	getHomeUrl(){
		if(this.props.homeUrl){
			return this.props.homeUrl;
		}

		return '#/home';
	}
	pushItem(item){
		let items = this.props.items.slice();
		items.push(item);
		this.setState({
			items: items
		})
	}
	_dopopBreadCrumb(e, item){
		if(this.props.popBreadCrumb){
			if(e)e.preventDefault();
			this.props.popBreadCrumb(item);
		}
	}
	_doselectHomePage(e, item){
		if(this.props.homeUrlAction){
			if(e)e.preventDefault();
			this.props.homeUrlAction(item);
		}
	}
	renderBreadCrumb(){
		let items = [];
		if(this.props.hideHome !== true){
			items.push(<Breadcrumb.Item href={this.getHomeUrl()} onClick={(e) => e.preventDefault()}>
						<AiOutlineCaretRight />
						{this.getHomeLabel()}
					</Breadcrumb.Item>
			);
		}

		if(this.props.items){
			this.props.items.map(item => {
				items.push(<Breadcrumb.Item href={item.href} onClick={(e) => this._dopopBreadCrumb(e, item)}>
					<AiOutlineCaretRight/>
					{item.title}
				</Breadcrumb.Item>);
			})
		}

		let locations = <Breadcrumb className="no-border">
			{items}
		</Breadcrumb>

		return <>
				<table className="app-breadcrum-table">
				    <tr>
				        <td class="dt-center">
				            <nav aria-label="breadcrumb">
				               {locations}
				            </nav>
				        </td>
				    </tr>
				</table>
		</>
	}
	render(){
		return this.renderBreadCrumb();
	}
}


export default AppBreadcrumb;
