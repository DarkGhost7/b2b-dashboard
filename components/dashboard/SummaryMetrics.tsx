import React from 'react';
import {formatAmount} from '@yearn-finance/web-lib/utils/format.number';

import type {ReactElement} from 'react';
import type {TPartnerVault} from 'types/types';
import type {TDict} from '@yearn-finance/web-lib/utils/types';

type TProps = {
	vaults: TDict<TPartnerVault>,
	vault: TPartnerVault,
	selectedIndex: number,
}

// Always pass metrics vaults as well as selected index? 
//  Give summary metrics vault and the vaults plus the selected index so it knows what to do 

function SummaryMetrics(props: TProps): ReactElement {
	const {vault, vaults} = props;

	const formatPercent = (n: number, min = 2, max = 2): string => `${formatAmount(n || 0, min, max)}%`;

	const allVaultsTVL = Object.values(vaults).reduce(((acc, vault): number => acc + vault.tvl), 0);
	const allVaultsFees = Object.values(vaults).reduce(((acc, vault): number => acc + vault.totalPayout), 0);
	
	return (
		<div>
			<div className={'my-20 hidden w-[80%] justify-between bg-good-ol-grey-100 md:flex'}>
				<div>
					<p>{'TVL'}</p>
					<h1>{'$ '}{vault ? formatAmount(props.vault.tvl) : formatAmount(allVaultsTVL)}</h1>
				</div>

				<div>
					<p>{'Fees earned to date'}</p>
					<h1>{'$ '}{vault ? formatAmount(props.vault.totalPayout, 0, 2) : formatAmount(allVaultsFees)}</h1>
				</div>

				<div>
					<p>{'Annual Yield'}</p>
					<h1>{vault ? formatPercent(props.vault.apy) : '-'}</h1>
				</div>

				<div>
					<p>{'Risk Score'}</p>
					<h1>{vault ? formatAmount(props.vault.riskScore, 0, 2) : '-'}</h1>
				</div>
			</div>

			<div className={'my-20 flex w-[60%] justify-between bg-good-ol-grey-100 md:hidden'}>
				<div>
					<div className={'mb-5'}>
						<p>{'TVL'}</p>
						<h1>{'$ '}{vault ? formatAmount(props.vault.tvl) : formatAmount(allVaultsTVL)}</h1>
					</div>

					<div>
						<p>{'Fees earned to date'}</p>
						<h1>{'$ '}{vault ? formatAmount(props.vault.balance, 0, 2) : formatAmount(allVaultsFees)}</h1>
					</div>
				</div>

				<div>
					<div className={'mb-5'}>
						<p>{'Annual Yield'}</p>
						<h1>{vault ? formatPercent(props.vault.apy) : '-'}</h1>
					</div>

					<div>
						<p>{'Risk Score'}</p>
						<h1>{vault ? formatAmount(props.vault.riskScore, 0, 2) : '-'}</h1>
					</div>
				</div>

			</div>
		</div>
	);
}

export default SummaryMetrics;
