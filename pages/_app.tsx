import React, {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {SessionProvider, useSession} from 'next-auth/react';
import {DefaultSeo} from 'next-seo';
import {YearnContextApp} from 'contexts/useYearn';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {WithYearn} from '@yearn-finance/web-lib/contexts/WithYearn';
import {useClientEffect} from '@yearn-finance/web-lib/hooks';
import {truncateHex} from '@yearn-finance/web-lib/utils/address';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '../style.css';

function	AppHead(): ReactElement {
	return (
		<>
			<Head>
				<title>{process.env.WEBSITE_NAME}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={process.env.WEBSITE_NAME} />
				<meta name={'msapplication-TileColor'} content={'#000000'} />
				<meta name={'theme-color'} content={'#FF90A1'} />

				<link
					rel={'shortcut icon'}
					type={'image/x-icon'}
					href={'/favicons/favicon.ico'} />
				<link
					rel={'apple-touch-icon'}
					sizes={'180x180'}
					href={'/favicons/apple-touch-icon.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'32x32'}
					href={'/favicons/favicon-32x32.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'16x16'}
					href={'/favicons/favicon-16x16.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'192x192'}
					href={'/favicons/android-chrome-192x192.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'512x512'}
					href={'/favicons/android-chrome-512x512.png'} />

				<meta name={'robots'} content={'index,nofollow'} />
				<meta name={'googlebot'} content={'index,nofollow'} />
				<meta charSet={'utf-8'} />
			</Head>
			<DefaultSeo
				title={process.env.WEBSITE_NAME}
				defaultTitle={process.env.WEBSITE_NAME}
				description={process.env.WEBSITE_DESCRIPTION}
				openGraph={{
					type: 'website',
					locale: 'en_US',
					url: process.env.WEBSITE_URI,
					site_name: process.env.WEBSITE_NAME,
					title: process.env.WEBSITE_NAME,
					description: process.env.WEBSITE_DESCRIPTION,
					images: [
						{
							url: `${process.env.WEBSITE_URI}og.jpeg`,
							width: 1200,
							height: 675,
							alt: 'Yearn'
						}
					]
				}}
				twitter={{
					handle: '@iearnfinance',
					site: '@iearnfinance',
					cardType: 'summary_large_image'
				}} />
		</>
	);
}

function	AppHeader(): ReactElement {
	const	router = useRouter();
	const	{isActive, address, ens, openLoginModal, onSwitchChain, onDesactivate} = useWeb3();
	const	{data: session} = useSession();
	const	[walletIdentity, set_walletIdentity] = useState('Log in');

	// const	hasPendingSignature = useRef(false);

	// const authenticate = useCallback(async (_ens: string): Promise<void> => {
	// 	if (hasPendingSignature.current) {
	// 		return;
	// 	}

	// 	hasPendingSignature.current = true;
	// 	const	signer = provider.getSigner();
	// 	const	signature = await signer.signMessage('YOU CAN\'T BUILD TRUSTLESS SYSTEMS WITHOUT TRUST.');
	// 	const	result = await signIn('web3', {redirect: false, address, signature});
	// 	hasPendingSignature.current = false;
	// 	if (result?.ok) {
	// 		set_walletIdentity(_ens ? _ens : truncateHex(address, 4));
	// 		if (router.query.callbackUrl) {
	// 			const	callbackUrl = (router.query.callbackUrl as string).replace(window.location.origin, '');
	// 			router.push(callbackUrl);
	// 		}
	// 	}

	// }, [provider, address, router]);

	useClientEffect((): void => {
		if (address) {
			set_walletIdentity(ens ? ens : truncateHex(address, 6));
		} else {
			set_walletIdentity('Log in');
		}
	}, [ens, address, isActive, session]);

	useClientEffect((): void => {
		if (session) {
			console.log(`Hello ${session.user?.name}`);
		}
	}, [session]);


	async function	onLogIn(): Promise<void> {
		if (isActive) {
			await onDesactivate();
			// if (session) {
			// 	await signOut({redirect: false});
			// }
		} else if (!isActive && address) {
			onSwitchChain(1, true);
		} else {
			openLoginModal();
		}
	}

	return (
		<header>
			<div className={'flex w-full flex-row items-center justify-between py-6'}>
				<nav className={'flex flex-row items-center space-x-6 md:space-x-10'}>
					<div>
						<Link href={'/'}>
							<p
								aria-selected={router.pathname === '/'}
								className={'project--nav'}>
								{'Main'}
							</p>
						</Link>
					</div>
					<div>
						<Link href={'/team-up'}>
							<p
								aria-selected={router.pathname === '/team-up'}
								className={'project--nav'}>
								{'Team up'}
							</p>
						</Link>
					</div>
					<div>
						<Link href={'/learn-more'}>
							<p
								aria-selected={router.pathname === '/learn-more'}
								className={'project--nav'}>
								{'Learn more'}
							</p>
						</Link>
					</div>
				</nav>

				<div className={'flex flex-row items-center space-x-6 md:space-x-10'}>
					<Button
						variant={'filled'}
						className={'!h-[30px]'}
						onClick={onLogIn}>
						{walletIdentity}
					</Button>
				</div>

			</div>
		</header>
	);
}

function	AppWrapper(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;

	return (
		<>
			<AppHead />
			<div id={'app'} className={'mx-auto mb-0 grid max-w-6xl grid-cols-12 flex-col gap-x-4 md:flex-row'}>
				<div className={'col-span-12 flex min-h-[100vh] w-full flex-col'}>
					<AppHeader />
					<Component
						key={router.route}
						router={props.router}
						{...pageProps} />
				</div>
			</div>
		</>
	);
}

function	MyApp(props: AppProps): ReactElement {
	const	{Component, pageProps} = props;

	return (
		<WithYearn
			options={{
				ui: {
					shouldUseThemes: false
				},
				web3: {
					defaultChainID: 1,
					supportedChainID: [1, 250, 42161, 1337, 31337]
				}
			}}>
			<YearnContextApp>
				<SessionProvider /*session={pageProps.session} */ >
					<AppWrapper
						Component={Component}
						pageProps={pageProps}
						router={props.router} />
				</SessionProvider>
			</YearnContextApp>
		</WithYearn>
	);
}

export default MyApp;
