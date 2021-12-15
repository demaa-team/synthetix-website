import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import media from 'styled-media-query';
import { theme } from 'src/styles/theme';
import { resetButtonCSS } from 'src/styles/common';

import snxjs from 'src/lib/snxjs';

import useSynthetixTokenList from 'src/queries/tokenLists/useSynthetixTokenList';
import useExchangeInfoQuery from 'src/queries/exchangeInfo/useExchangeInfoQuery';

import SynthCard from './SynthCard';
import { useRouter } from 'next/router'
import { keyBy } from 'lodash';

enum SynthCategory {
	ALL = 'all',
	CRYPTO = 'crypto',
	FOREX = 'forex',
	EQUITIES = 'equities',
	COMMODITY = 'commodity',
	INDEX='index'
}

const SYNTH_CATEGORIES = Object.values(SynthCategory);

const SynthsInfo = () => {
	const {query} = useRouter();

	const [synthCategory, setSynthCategory] = useState<SynthCategory>(SynthCategory.ALL);
	const synthetixTokenListQuery = useSynthetixTokenList();
	const synthetixTokensMap = synthetixTokenListQuery.isSuccess
		? synthetixTokenListQuery.data.tokensMap ?? null
		: null;
	const synths = snxjs.synths;
	
	const filteredSynths = useMemo(
		() =>
			synthCategory !== SynthCategory.ALL
				? synths.filter((synth) => synth.category.toString() === synthCategory.toString())
				: synths,
		[synths, synthCategory]
	);

	const exchangeInfoQuery = useExchangeInfoQuery();
	const exchangeInfo = exchangeInfoQuery.isSuccess ? exchangeInfoQuery.data ?? null : null;

	const exchangeRates = exchangeInfo?.rates ?? null;
	const exchangeFees = exchangeInfo?.fees ?? null;
	const placeHolder=filteredSynths.length%3===0?[]:Array(3-(filteredSynths.length%3)).fill(0);

	useEffect(()=>{
		const {categories}=query;
		
		setSynthCategory(!categories ? SynthCategory.ALL:categories as SynthCategory);
	},[query])

	return (
		<>
			{/* <Categories>
				{SYNTH_CATEGORIES.map((category) => {
					const active = synthCategory === category;

					return (
						<Button
							key={category}
							onClick={() => {
								setSynthCategory(active ? SynthCategory.ALL : category);
							}}
							{...{ active }}
						>
							{category}
						</Button>
					);
				})}
			</Categories> */}
			<Cards>
				{filteredSynths.map((synth) => {
					const currencyKey = synth.name;

					const tokenInfo = synthetixTokensMap != null ? synthetixTokensMap[currencyKey] : null;

					const price = exchangeRates != null ? exchangeRates[currencyKey] : null;
					const exchangeFeeRate = exchangeFees != null ? exchangeFees[currencyKey] : null;

					return <SynthCard key={currencyKey} {...{ synth, tokenInfo, price, exchangeFeeRate }} />;
				})}
				{
					placeHolder.map((v,i)=><PlaceHolderStyle key={i}/>)
				}
			</Cards>
		</>
	);
};
const Cards = styled.div`
	padding-bottom: 120px;
	/* display: grid;
	grid-template-columns: repeat(3, 1fr);
	justify-content: center;
	grid-gap: 35px; */
	margin-top:-154px;
    display: flex;
    flex-wrap: wrap;
	justify-content: center;
	
	${media.lessThan('medium')`
		grid-template-columns: 1fr;
		justify-items: center;
	`}
`;

const Categories = styled.div`
	display: grid;
	margin-bottom: 40px;
	grid-auto-flow: column;
	justify-content: start;
	grid-gap: 50px;

	${media.lessThan('small')`
		grid-auto-flow: initial;
    	grid-template-columns: repeat(3, auto);
    	margin-bottom: 20px;
		grid-gap: initial;
		justify-content: initial;
		justify-items: start;
	`}
`;

const Button = styled.button<{ active: boolean }>`
	${resetButtonCSS};
	${theme.fonts.tab};

	${media.lessThan('medium')`
		font-size: 12px;
		line-height: 48px;
		margin-right: 18px;
	`}
`;

const PlaceHolderStyle=styled.div`
	width: 484px;
	height: 640px;
	margin: 16px;
`

export default SynthsInfo;
