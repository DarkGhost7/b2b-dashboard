import React, {useMemo, useState} from 'react';
import Link from 'next/link';
import {PARTNERS} from 'utils/b2b/Partners';
import useSWR from 'swr';
import {motion} from 'framer-motion';
import {useSettings} from '@yearn-finance/web-lib/contexts/useSettings';
import {baseFetcher} from '@yearn-finance/web-lib/utils/fetchers';

import LogoYearn from './icons/LogoYearn';

import type {ReactElement} from 'react';
import type {SWRResponse} from 'swr';
import type {TFramerTransition, TPartner} from 'types/types';
import type {TDict} from '@yearn-finance/web-lib/utils/types';

const variants = {
	enter: (i: number): TFramerTransition => ({
		y: 0,
		opacity: 1,
		transition: {
			delay: i * 0.1,
			duration: 0.5,
			ease: 'linear'
		}
	}),
	initial: {y: 60, opacity: 0}
};

function	Partners(): ReactElement {
	const {settings: baseAPISettings} = useSettings();
	const	[partnerList, set_partnerList] = useState<TPartner[]>([]);

	const	{data: partners} = useSWR(
		`${baseAPISettings.yDaemonBaseURI}/partners/all`,
		baseFetcher,
		{revalidateOnFocus: false}
	) as SWRResponse;


	useMemo((): void => {
		const _partners: TDict<TPartner> = {};

		for (const [, vaultsForNetwork] of Object.entries(partners || {})) {
			for (const [, currentVault] of Object.entries(vaultsForNetwork || {})) {
				const shortName = currentVault.name.toLowerCase();
				const {description} = currentVault;
				const logo = PARTNERS[shortName] ? PARTNERS[shortName].logo : <LogoYearn className={'text-900'} />;

				_partners[shortName] = {name: currentVault.full_name, shortName, description, logo};
			}
		}
		
		const	_partnerList = Object.values(_partners);

		// Fisher Yates shuffle - for "random" order
		for (let i = _partnerList.length -1; i > 0; i--) {
			const j = Math.floor(Math.random() * i);
			const k = _partnerList[i];
			_partnerList[i] = _partnerList[j];
			_partnerList[j] = k;
		}
		
		set_partnerList(_partnerList.slice(0, 9));
	}, [partners]);


	return (
		<section aria-label={'partners'} className={'mb-28 flex flex-row items-center space-x-8 md:mb-50'}>
			<div>
				<div>
					<h2 className={'text-3xl font-bold'}>{'Built on Yearn'}</h2>
				</div>
				<div className={'mt-8 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3'}>
					{partnerList?.map((partner: TPartner, i: number): ReactElement => (
						<Link key={partner.name} href={`/dashboard/${partner.shortName}`}>
							<motion.div
								custom={i % 3}
								initial={'initial'}
								whileInView={'enter'}
								className={'flex h-66 cursor-pointer flex-col justify-between border-2 border-neutral-200 bg-neutral-200 p-6'}
								variants={variants}>
								<div className={'h-14'}>
									{partner.logo}
								</div>
								<div className={'space-y-2'}>
									<b className={'text-lg'}>{partner.name}</b>
									<p>{partner.description}</p>
								</div>
							</motion.div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

export default Partners;
