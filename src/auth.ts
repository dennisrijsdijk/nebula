import {CLIENT_ID, FETCH_HEADERS, NEBULA_OAUTH_TOKEN_URL} from "./constants";

/**
 * Represents the auth object returned after authenticating with username and password.
 * @property accessTokenExp - Access Token Expiry in milliseconds epoch.
 * @property refreshTokenExp - Refresh Token Expiry in milliseconds epoch.
 */

export type AuthData = {
    accessToken: string;
    accessTokenExp: number;
    refreshToken: string;
    refreshTokenExp: number;
}

export type LoginTokens = {
    access?: {
        token: string;
        tokenExp: number;
    }
    refresh: {
        refreshToken: string;
        refreshTokenExp?: number;
    }
}

type LoginResponse = {
    access_token: string;
    auth_trust_id: string;
    bans: never[];
    display_name: string;
    expires_in: number;
    is_comply: boolean;
    jflgs: number;
    namespace: string;
    namespace_roles: {
        roleId: string;
        namespace: string;
    }[];
    permissions: never[];
    platform_id: string;
    platform_user_id: string;
    refresh_expires_in: number;
    refresh_token: string;
    roles: string[];
    scope: string;
    token_type: string;
    user_id: string;
    xuid: string;
}

export class AuthContainer {
    private readonly refreshCallback: (data: AuthData) => void | Promise<void>;
    private authData?: AuthData;
    constructor(refreshCallback: (data: AuthData) => void | Promise<void>) {
        this.refreshCallback = refreshCallback;
    }

    getAccessToken() { return this.authData?.accessToken; }

    async loginWithToken(refreshToken: string){
        if (this.authData != null) {
            throw new Error("already logged in.");
        }
        this.authData = {
            accessToken: "",
            accessTokenExp: 0,
            refreshToken: refreshToken,
            refreshTokenExp: 0
        }
        await this.refresh(true);
    }

    private async login(form: URLSearchParams) {
        const apiCall = await fetch(NEBULA_OAUTH_TOKEN_URL, {
            method: 'POST',
            headers: {
                ...FETCH_HEADERS,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form
        })
        if (apiCall.status !== 200) {
            throw new Error(`${apiCall.statusText}: ${apiCall.body}`);
        }

        const loginResponse = (await apiCall.json()) as LoginResponse;

        this.authData = {
            accessToken: loginResponse.access_token,
            accessTokenExp: Date.now() + loginResponse.expires_in * 1000,
            refreshToken: loginResponse.refresh_token,
            refreshTokenExp: Date.now() + loginResponse.refresh_expires_in * 1000
        };

        await this.refreshCallback(this.authData);
    }

    async loginWithCredentials(username: string, password: string) {
        if (this.authData != null) {
            throw new Error("already logged in.");
        }

        const form = new URLSearchParams();
        form.append('username', username);
        form.append('password', password);
        form.append('grant_type', 'password');
        form.append('client_id', CLIENT_ID);
        form.append('extend_exp', 'true');

        await this.login(form);
    }

    async refresh(force: boolean = false) {
        if (this.authData == null) {
            throw new Error("not logged in.");
        }

        if (!force && this.authData.accessTokenExp <= Date.now()) {
            return false;
        }

        const form = new URLSearchParams();
        form.append('grant_type', 'refresh_token');
        form.append('client_id', CLIENT_ID);
        form.append('refresh_token', this.authData.refreshToken);

        await this.login(form);
        return true;
    }

    logout() {
        this.authData = undefined;
    }
}
