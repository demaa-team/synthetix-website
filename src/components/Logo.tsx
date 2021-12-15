import styled from 'styled-components';
type LogoProps = { readonly small?: boolean };

const LogoComponent = ({ small }: LogoProps) => {
	// const src = small ? '/logo-x.svg' : 'logo.svg';
	const src = 'demaa.png';

	return (
		<Wrapper>
			<img src={src} alt="" style={{ width: '136px', height: '34px' }} />
		</Wrapper>

	);
};

const Wrapper = styled.a.attrs({
    href: '/'
})`
    display: flex;
	align-items: center;
    height: 100%;
	&::after{
		content: '';
		display:inline-block;
		width:2px;
		height:100%;
		background:#020931;	
		opacity: 0.26;
		margin-left: 18px;
	}
`;

export default LogoComponent;
