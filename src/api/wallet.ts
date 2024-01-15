import {NEBULA_CURRENCY_URL} from "../constants";

export type WalletInfo = {
    id: string;
    namespace: string;
    userId: string;
    currencyCode: string;
    currencySymbol: string;
    balance: number;
    balanceOrigin: string;
    timeLimitedBalances: never[];
    createdAt: string;
    updatedAt: string;
    totalPermanentBalance: number;
    totalTimeLimitedBalance: number;
    status: string;
}

export type Wallet = {
    namespace: string;
    userId: string;
    currencyCode: string;
    currencySymbol: string;
    balance: number;
    walletInfos: WalletInfo[];
    walletStatus: string;
    status: string;
    id: string;
}

async function getWallet(accessToken: string, currency: string) {
    const apiCall = await fetch(
        `${NEBULA_CURRENCY_URL}/${currency}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    );
    if (apiCall.status !== 200) {
        throw new Error(`${apiCall.statusText}: ${apiCall.body}`);
    }

    return (await apiCall.json()) as Wallet;
}

export async function getWalletCStacks(accessToken: string) {
    return getWallet(accessToken, 'GOLD');
}

export async function getWalletCash(accessToken: string) {
    return getWallet(accessToken, 'CASH');
}

export async function getWalletPremium(accessToken: string) {
    return getWallet(accessToken, 'CRED');
}

export async function getAllWallets(accessToken: string) {
const [cash, stacks, premium] = await Promise.all([
        getWalletCash(accessToken),
        getWalletCStacks(accessToken),
        getWalletPremium(accessToken)
    ]);

    return {
        cash,
        stacks,
        premium
    };
}
