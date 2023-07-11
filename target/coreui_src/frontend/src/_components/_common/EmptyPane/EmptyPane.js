import React from "react";
import logo from "assets/no-content-white.png";

const KatappultEmptyPane = ({mainMessage, secondaryMessage}) => {

	const logoDisplay = <img src={logo} width="220" alt="katappult.cloud"/>
	const message = mainMessage ? mainMessage : 'No element'
	return (

		<div style={Style} className={'fadeIn'}>
			{logoDisplay}
			<p style={MainMessageStyle}>{message}</p>
			{secondaryMessage && <p style={SecondaryMessageStyle}>secondaryMessage</p>}
		</div>
	)
}

export default KatappultEmptyPane;

const Style = {
	background: 'transparent',
	width: '98%',
	height: '80%',
	margin: '12px',
	padding: '24px 0 0 0 ',
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	borderRadius:'8px',
	justifyContent: 'center'
}

const MainMessageStyle ={
	fontWeight: '400',
	fontSize: '18px'
}

const SecondaryMessageStyle ={
	fontWeight: '200',
	fontSize: '12px'
}
