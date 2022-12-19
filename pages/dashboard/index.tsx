
import	React, {useEffect, useState}		from	'react';
import {VaultDetailsTabsWrapper} from 'components/dashboard/VaultDetailsTabsWrapper';
import {usePartner} from 'contexts/usePartner';
import {LOGOS, PARTNERS} from 'utils/b2b/Partners';
import {Button} from '@yearn-finance/web-lib/components/Button';

import type {ChangeEvent, FormEvent, ReactElement} from 'react';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const lastMonth = currentDate.getMonth() - 1;

const today = formatDate(currentDate);
const firstDayLastMonth = formatDate(new Date(new Date().setFullYear(currentYear, lastMonth, 1)));

function formatDate(date: Date): string {
	return date.toLocaleDateString('en-CA');
}

function	Index(): ReactElement {
	const	{partner, logo, set_partner} = usePartner();
	const [lastSync, set_lastSync] = useState('');
	const [reportStart, set_reportStart] = useState(firstDayLastMonth);
	const [reportEnd, set_reportEnd] = useState(today);

	useEffect((): void => {
		const latestSync = new Date().toLocaleString('default',
			{month: 'long', day: '2-digit', year: 'numeric', hour: 'numeric', minute:'numeric'});

		set_lastSync(latestSync);
	}, []);


	useEffect((): void => {
		if(partner === '' && logo && set_partner){
			// Until auth is finialized, Set random partner if one is not currently selected
			const {name} = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];
			set_partner(name);
			logo.current = LOGOS[name];
		}
	}, [logo, partner, set_partner]);


	function downloadReport(e: FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		alert('Feature currently unavailable');
	}

	function handleReportDateChange(e: ChangeEvent<HTMLInputElement>): void {
		const rangeValue = e.target.value;

		if(e.target.name === 'range-start'){
			set_reportStart(rangeValue);
		}else {
			set_reportEnd(rangeValue);
		}
	}

	return (
		<main>
			<section aria-label={'hero'} className={'mt-[75px] mb-14 grid grid-cols-12'}>
				<div className={'col-span-12 md:col-span-7'}>
					<h1 className={'mb-2 text-6xl text-neutral-900 md:text-8xl'}>{partner}</h1>

					<p className={'mb-10 w-3/4 text-neutral-500'}>{`Last updated ${lastSync}`}</p>

					<form onSubmit={downloadReport}>
						<div className={'mt-2 flex flex-row items-end space-x-4'}>
							<div>
								<label className={'block text-neutral-500'} htmlFor={'start'}>{'From'}</label>
								<input
									className={'text-neutral-500'}
									type={'date'}
									id={'start'}
									name={'range-start'}
									value={reportStart}
									onChange={handleReportDateChange}
									min={'2021-01-01'}
									max={reportEnd} />
							</div>

							<div>
								<label className={'block text-neutral-500'} htmlFor={'end'}>{'To'}</label>
								<input
									className={'text-neutral-500'}
									type={'date'}
									id={'end'}
									name={'range-end'}
									value={reportEnd}
									onChange={handleReportDateChange}
									min={'2021-01-01'}
									max={today} />
							</div>

							<Button
								className={'w-[200px] text-sm  md:text-base'}
								variant={'filled'}>
								{'Download Report'}
							</Button>
						</div>
					</form>
				</div>

				<div className={'col-span-1 hidden md:block'} />

				<div className={'col-span-3 hidden md:block'}>
					{logo?.current}
				</div>

				<div className={'col-span-2 hidden md:block'} />
			</section>

			<section aria-label={'tabs'}>
				<VaultDetailsTabsWrapper />
			</section>
		</main>
	);
}

export default Index;
