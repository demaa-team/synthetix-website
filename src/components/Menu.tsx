import styled from 'styled-components';
import media from 'styled-media-query';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState } from 'react';

import { theme } from '../styles/theme';
import { ExternalLink } from '../styles/common';

const data = [
	{
		link: '/synths',
		label: 'synths',
		hideOnHeader: false,
		children:[
			{
				query: 'all',
				label: 'ALL',
				hideOnHeader: false,
			},{
				query: 'forex',
				label: 'FOREX',
				hideOnHeader: false,
			},{
				query: 'crypto',
				label: 'CRYPTO',
				hideOnHeader: false,
			},{
				query: 'index',
				label: 'INDEX',
				hideOnHeader: false,
			}
		],
		_showDropMenu:false
	},
	{
		externalLink: 'https://stats.synthetix.io',
		label: 'stats',
		hideOnHeader: false,
		_showDropMenu:false
	},
	{
		externalLink: 'https://staking.synthetix.io',
		label: 'staking',
		hideOnHeader: false,
		_showDropMenu:false
	},
	// {
	// 	externalLink: 'https://docs.synthetix.io/',
	// 	label: 'build',
	// 	hideOnHeader: false,
	// },
	// {
	// 	externalLink: 'https://gov.synthetix.io/',
	// 	label: 'governance',
	// 	hideOnHeader: false,
	// },
	// {
	// 	externalLink: 'https://discord.com/invite/AEdUHzt',
	// 	label: 'community',
	// 	hideOnHeader: false,
	// },
	// {
	// 	externalLink: 'https://jobs.defialliance.co/companies/synthetix',
	// 	label: 'careers',
	// 	hideOnHeader: true,
	// },
	// {
	// 	externalLink: 'https://blog.synthetix.io/',
	// 	label: 'blog',
	// 	hideOnHeader: false,
	// },
	// {
	// 	externalLink: 'https://research.synthetix.io/',
	// 	label: 'research',
	// 	hideOnHeader: true,
	// },
];

interface MenuProps {
	isOpen?: boolean;
	isHeader?: boolean;
	isFooter?:boolean;
}

const MenuComponent = (props: MenuProps) => {
	const {isFooter}=props;
	const router = useRouter();
	const {categories='all'}=router.query;
	
	const [menuList,setMenuList]=useState(data);
	const HanleToggleMenu=(item:any,index:number)=>{
		menuList[index]._showDropMenu=!menuList[index]._showDropMenu;
		setMenuList([...menuList]);
		if(router.pathname === item.link)return;
		router.push(item.link);
	}
	const handleDropMenuClick=(item:any,parentIndex:any)=>{
		menuList[parentIndex]._showDropMenu=!menuList[parentIndex]._showDropMenu;
		setMenuList([...menuList]);
		router.push(`/synths?categories=${item.query}`);
	}
	return (
		<Menu {...props}>
			{menuList.map((item,index) => {
				return (
					<>
						{!item.hideOnHeader && 

							
						(
							!isFooter&&item.children?.length?
							<MenuItem key={item.label}>
								<WrapperMenu onClick={()=>HanleToggleMenu(item,index)}>
									<ItemDropDownName className={router.pathname === item.link?'selected':''}>{item.label}</ItemDropDownName>
									<ItemDropDownIcon className={item._showDropMenu?'expand':'shrink'}></ItemDropDownIcon>
								</WrapperMenu>
								{
									item._showDropMenu&&
									<DropDownMenu>
										{
											item.children.map(v=>
												<ItemDropMenu className={categories === v.query?'selected':''} onClick={()=>handleDropMenuClick(v,index)}>{v.label}</ItemDropMenu>
											)
										}
									</DropDownMenu>
								}
								
							</MenuItem>
							:
							<MenuItem key={item.label}>
								{item.link ? (
									<Link href={item.link}>
										<a style={{'color':router.pathname === item.link?'#F86C29':''}}>{item.label}</a>
									</Link>
								) : (
									<ExternalLink href={item.externalLink}>{item.label}</ExternalLink>
								)}
							</MenuItem>
						)}
					</>
				);
			// 	if (props.isHeader) {
			// 		return (
			// 			<>
			// 				{!item.hideOnHeader && (
			// 					<MenuItem key={item.label}>
			// 						{item.link ? (
			// 							<Link href={item.link}>
			// 								<a>{item.label}</a>
			// 							</Link>
			// 						) : (
			// 							<ExternalLink href={item.externalLink}>{item.label}</ExternalLink>
			// 						)}
			// 					</MenuItem>
			// 				)}
			// 			</>
			// 		);
			// 	} else {
			// 		return (
			// 			<MenuItem key={item.label}>
			// 				{item.link ? (
			// 					<Link href={item.link}>
			// 						<a>{item.label}</a>
			// 					</Link>
			// 				) : (
			// 					<ExternalLink href={item.externalLink}>{item.label}</ExternalLink>
			// 				)}
			// 			</MenuItem>
			// 		);
			// 	}
			})}
		</Menu>
	);
};

const Menu = styled.ul`
	transition: left 0.3s ease-out;
	z-index: 101;
	display:flex;
	height:100%;
	${media.lessThan('medium')`
		position: fixed;
		display: flex;
		flex-direction: column;
		top: 0;
		padding-top: 100px;
		left: -100%;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: linear-gradient(180deg, #08021E 0%, #120446 146.21%);
	`}

	/* &.enter-active, &.enter-done {
		left: 0;
	} */
`;

const MenuItem = styled.li`
	display: flex;
	width:130px;
	height:100%;
	align-items:center;
	justify-content:center;
	position:relative;
	cursor:pointer;
	&:last-child {
		&:after{
			display:none;
		}
	}
	&:after{
		content:'';
		display:inline-block;
		width:2px;
		height:38px;
		background:#020931;
		opacity: 0.62;
		position: absolute;
    	right: 0;
	}

	a {
		${theme.fonts.menu};
		transition: color 0.3s ease-out;

		&:hover {
			color: ${theme.colors.cyan};
		}
	}

	${media.lessThan('medium')`
	margin: 0 0 51px 20px;
		a {
			font-size: 32px;
			line-height: 24px;
		}
	`}
`;

const DropDownMenu=styled.ul`
	position:absolute;
	bottom: 7px;
    transform: translateY(100%);
	width: 108px;
	background: rgba(146, 161, 248, 0.5);
	border-radius: 5px;
	padding:0 10px;
	&:before{
		content:'';
		display:block;
		position:absolute;
    	left: 50%;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 7px solid rgba(146, 161, 248, 0.5);
		transform: translate(-50%, -7px);
	}
`
const ItemDropMenu=styled.li`
	height:50px;
	line-height:50px;
	text-align:center;
	font-size: 18px;
	font-weight: bold;
	color: #FFFFFF;
	border-bottom:2px solid rgba(30, 42, 106, 1);
	&.selected{
		color: #F86C29;
	}
	&:last-child{
		border-bottom:none;
	}
`
const WrapperMenu=styled.div`
	display:flex;
	align-items:center;
`
const ItemDropDownName=styled.a`
	&.selected{
		color:#F86C29;
	}
`

const keyframes = {
	up: `@keyframes up {
		from{
			transform: rotateZ(0);
		}
		to {
			transform: rotateZ(-180deg);
		}
	}`,
	down: `@keyframes down {
		from{
			transform: rotateZ(-180deg);
		}
		to {
			transform: rotateZ(0deg);
		}
	}`,
};

const animations = {
	up: `
		animation: up 200ms linear forwards;
		${keyframes.up}
	`,
  down: `
		animation: down 200ms linear forwards;
		${keyframes.down}
	`,
};
const ItemDropDownIcon=styled.span`
	display:inline-block;
	width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 7px solid #F86C29;
	margin-left:8px;
	margin-top:3px;
	&.expand{
		${animations.down};
	}
	&.shrink{
		${animations.up};
	}
`


export default MenuComponent;
