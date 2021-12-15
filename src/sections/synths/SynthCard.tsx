import { FC, useMemo } from 'react';
import styled, { css } from 'styled-components';
import media from 'styled-media-query';

import {
	Card,
	CardGradient,
	ExternalLink,
	FlexDivCentered,
	FlexDivRowCentered,
} from 'src/styles/common';

import { Synth } from '@synthetixio/contracts-interface';

import { Token } from 'src/queries/tokenLists/types';
import { formatFiatCurrency, formatPercent } from 'src/utils/formatters/number';
import useMarketClosed from 'src/hooks/useMarketClosed';

enum SynthStatus {
	LIVE = 'live',
	FROZEN = 'frozen',
	PAUSED = 'paused',
}

type SynthCardProps = {
	synth: Synth;
	tokenInfo: Token | null;
	price: number | null;
	exchangeFeeRate: number | null;
};

const SynthCard: FC<SynthCardProps> = ({ synth, tokenInfo, price, exchangeFeeRate }) => {
	const logoURI = tokenInfo != null ? tokenInfo.logoURI : null;

	const currencyKey = synth.name;

	let synthDescription = `Tracks the price of ${currencyKey} ${synth.description} through price feeds supplied by an oracle.`;

	if (currencyKey === 'sUSD') {
		synthDescription =
			'Tracks the price of a single US Dollar (USD). This Synth always remains constant at 1.';
	} else if (currencyKey.startsWith('i')) {
		synthDescription = `Inversely tracks the price of ${currencyKey} ${synth.description} through price feeds supplied by an oracle.`;
	} else if (synth.category.includes('index')) {
		synthDescription = `Tracks the price of the index: ${currencyKey} ${synth.description} through price feeds supplied by an oracle.`;
	}

	const marketClosed = useMarketClosed(currencyKey);

	const synthStatus = useMemo(() => {
		if (marketClosed.isCurrencyFrozen) {
			return SynthStatus.FROZEN;
		}
		if (marketClosed.isMarketClosed) {
			return SynthStatus.PAUSED;
		}
		return SynthStatus.LIVE;
	}, [marketClosed]);

	return (
		<ExternalLink href={`https://kwenta.io/exchange/${currencyKey}`}>
			<StyledCard>
				<CardGradient />
				<FlexDivCentered style={{width:'100%'}}>
					{/* <SynthImageContainer>
						{logoURI ? <img src={logoURI} alt="" /> : <Placeholder>{currencyKey}</Placeholder>}
					</SynthImageContainer> */}

					<Wrapper>
						<SynthSymbol>{currencyKey}</SynthSymbol>
						<div className="usdPrice">
							<SynthPriceLabel>usd price</SynthPriceLabel>
							<SynthPrice>
								{price != null ? formatFiatCurrency(price, { sign: '$' }) : '-'}
							</SynthPrice>
						</div>
					</Wrapper>
				</FlexDivCentered>
				<FlexDivRowCentered className="feeWrapper">
					<FeeInfo>fee: {exchangeFeeRate != null ? formatPercent(exchangeFeeRate) : '-'}</FeeInfo>
					<Status synthStatus={synthStatus}>
						<StatusDot /> 
						<StatusText>{synthStatus}</StatusText>
					</Status>
				</FlexDivRowCentered>
				<SynthDescription>{synthDescription}</SynthDescription>
				
				<RoundArrow></RoundArrow>
			</StyledCard>
		</ExternalLink>
	);
};

const StyledCard = styled(Card)`
	/* padding: 30px; */
	padding: 45px 73px 45px 88px;
	margin: 16px;
	${media.lessThan('medium')`
		width: 100%;
    	max-width: 360px;
	`}
	/* display: grid;
	grid-template-rows: auto 1fr auto; */
	.feeWrapper{
		margin-top: 100px;
	}
`;

const Placeholder = styled(FlexDivCentered)`
	border-radius: 50%;
	color: ${(props) => props.theme.colors.white};
	border: 1px solid ${(props) => props.theme.colors.white};
	font-family: ${(props) => props.theme.fonts.bold};
	justify-content: center;
	margin: 0 auto;
	width: 60px;
	height: 60px;
`;

const SynthImageContainer = styled.div`
	display: flex;
	padding-right: 25px;
	img {
		width: 60px;
		height: 60px;
	}
`;

const SynthSymbol = styled.div`
	font-family: MicrosoftYaHei-Bold,GT America;
	font-weight: bold;
	/* font-stretch: expanded; */
	font-size: 30px;
	/* line-height: 48px; */
	letter-spacing: 1px;
	color: ${(props) => props.theme.colors.white};
`;

const SynthPriceLabel = styled.div`
	font-family: Microsoft YaHe,GT America;
	/* font-weight: 400; */
	/* font-stretch: condensed; */
	/* color: ${(props) => props.theme.colors.gray55}; */
	text-transform: uppercase;
	color: #fff;
	font-size:20px;
`;

const SynthPrice = styled.div`
	font-family: Microsoft YaHei;;
	font-weight: bold;
	font-stretch: expanded;
	/* color: ${(props) => props.theme.colors.white}; */
	font-size: 30px;
	color:#F86C29;
`;

const SynthDescription = styled(FlexDivCentered)`
	margin-top: 80px;
	font-size: 18px;
	line-height: 28px;
	/* color: ${(props) => props.theme.colors.gray20}; */
	color: #E5E9FA;
`;

const FeeInfo = styled.div`
	color: ${(props) => props.theme.colors.white};
	font-size: 24px;
	line-height: 24px;
	text-transform: uppercase;
	/* font-family: GT America; */
	font-family: Microsoft YaHei;
	font-weight: 700;
	font-stretch: condensed;
`;

const StatusDot = styled.div`
	width: 22px;
	height: 18px;
	/* box-shadow: 0px 0px 10px rgba(0, 209, 255, 0.5); */
	margin-right: 16px;
	background: url('synths/live-icon.png') no-repeat center;
	background-size: 100%;
`;
const StatusText=styled.div`
	font-size: 24px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	color: #F86C29;
`

const Status = styled(FlexDivCentered)<{ synthStatus: SynthStatus }>`
	text-transform: uppercase;
	font-family: GT America;
	font-weight: 700;
	font-stretch: condensed;
	/* TODO LIVE 状态变化 */
	/* ${(props) => {
		switch (props.synthStatus) {
			case SynthStatus.LIVE: {
				return css`
					color: ${(props) => props.theme.colors.green};
					${StatusDot} {
						background: ${(props) => props.theme.colors.green};
					}
				`;
			}
			case SynthStatus.PAUSED: {
				return css`
					color: ${(props) => props.theme.colors.orange};
					${StatusDot} {
						background: ${(props) => props.theme.colors.orange};
					}
				`;
			}
			case SynthStatus.FROZEN: {
				return css`
					color: ${(props) => props.theme.colors.pink};
					${StatusDot} {
						background: ${(props) => props.theme.colors.pink};
					}
				`;
			}
			default:
				return css`
					color: ${(props) => props.theme.colors.green};
					${StatusDot} {
						background: ${(props) => props.theme.colors.green};
					}
				`;
		}
	}} */
`;

const Wrapper=styled.div`
	width: 100%;
	.usdPrice{
		width:100%;
		margin-top: 26px;
		display: flex;
		justify-content: space-between;
	}
`

const RoundArrow=styled.div`
	width:38px;
	height:38px;
	margin: 120px auto 0;
	background: url('synths/round-arrow.png') no-repeat center;
	background-size: 100%;
`

export default SynthCard;
