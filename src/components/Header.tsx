import { useState, useEffect } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';
import HamburgerMenu from 'react-hamburger-menu';
import { CSSTransition } from 'react-transition-group';

import { Logo, Menu } from './';

const HeaderComponent = () => {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	let [animationProps, setAnimationProps] = useState({ mountOnEnter: true, unmountOnExit: true });

	useEffect(
		function () {
			if (isOpen) {
				document.body.classList.add('fixed');
			} else {
				document.body.classList.remove('fixed');
				if (window.innerWidth < 768) {
					setAnimationProps({
						mountOnEnter: true,
						unmountOnExit: true,
					});
				}
			}
		},
		[isOpen]
	);

	// const clickMenu = () => {
	// 	setIsOpen(!isOpen);
	// };

	return (
		<Header>
			{/* <StyledHamburgerMenu
				isOpen={isOpen}
				menuClicked={clickMenu}
				width={22}
				height={16}
				strokeWidth={2}
				rotate={0}
				color="white"
				borderRadius={0}
				animationDuration={0.3}
			/> */}
			<Logo />
			<Menu isHeader={true} />
			{/* isOpen={isOpen} */}
			{/* <CSSTransition in={isOpen} timeout={300} {...animationProps}>
				
			</CSSTransition> */}
		</Header>
	);
};

export const headerHeight = 76;

const Header = styled.header`
	background:#203298;
	/* opacity: 0; */
	height: ${headerHeight}px;
	width: 100%;
	padding: 0 38px;
	position: relative;
	/* background: linear-gradient(180deg, #08021E 0%, #120446 146.21%); */
	z-index: 100;
	display: flex;
	align-items: center;
	/* justify-content: space-between; */
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);

	${media.lessThan('medium')`
		border-bottom: 0;
		padding: 0 20px;
		justify-content: center;
	`}
`;

// const StyledHamburgerMenu = styled(HamburgerMenu)`
// 	// display: none;

// 	${media.lessThan('medium')`
// 		display: block;
// 		cursor: pointer;
// 		user-select: none;
// 		left: 20px;
// 		top: 39px;
// 		position: ${(props) => ((props as any).isOpen ? 'fixed' : 'absolute')} !important;
// 		z-index: 999;
// 	`}
// `;
export default HeaderComponent;
