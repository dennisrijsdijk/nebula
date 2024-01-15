import {AuthContainer} from "../auth";
import {getSaveData, getUser} from "./user";
import {getAllWallets, getWalletCash, getWalletCStacks, getWalletPremium} from "./wallet";
import {getChallenges} from "./challenge";

export {User} from "./user";
export {Wallet, WalletInfo} from './wallet';
export {Challenge} from './challenge';

export class ApiClient {
    private authContainer: AuthContainer;

    private async getToken() {
        await this.authContainer.refresh();
        const token =  this.authContainer.getAccessToken();
        if (!token) {
            throw new Error("trying to make an API request with an undefined token.");
        }
        return token;
    }

    async getChallenges() {
        return getChallenges(await this.getToken());
    }

    async getUser() {
        return getUser(await this.getToken());
    }

    async getUserSaveData() {
        return getSaveData(await this.getToken());
    }

    async getCash() {
        return getWalletCash(await this.getToken());
    }

    async getStacks() {
        return getWalletCStacks(await this.getToken());
    }

    async getPremiumCurrency() {
        return getWalletPremium(await this.getToken());
    }

    async getAllCurrency() {
        return getAllWallets(await this.getToken());
    }

    constructor (auth: AuthContainer) {
        this.authContainer = auth;
    }
}
