import {NEBULA_CLOUDSAVE_BASE_URL, NEBULA_USER_URL} from "../constants";

export type User = {
    authType: string;
    bans: never[];
    country: string;
    createdAt: string;
    dateOfBirth: string;
    displayName: string;
    deletionStatus: boolean;
    emailVerified: boolean;
    enabled: boolean;
    lastDateOfBirthChangedTime: string;
    lastEnabledChangedTime: string;
    emailAddress: string;
    namespace: string;
    namespaceRoles: {
        roleId: string;
        namespace: string;
    }[];
    oldEmailAddress: string;
    permissions: never[];
    phoneVerified: boolean;
    roles: string[];
    userId: string;
    userName: string;
    avatarUrl: string;
}

export async function getUser(accessToken: string): Promise<User> {
    const apiCall = await fetch(NEBULA_USER_URL, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    if (apiCall.status !== 200) {
        throw new Error(`${apiCall.statusText}: ${apiCall.body}`);
    }

    return (await apiCall.json()) as User;
}

export async function getSaveData(accessToken: string): Promise<any> {
    const user = await getUser(accessToken);

    const apiCall = await fetch(
        `${NEBULA_CLOUDSAVE_BASE_URL}/${user.userId}/records/progressionsavegame`,
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

    return await apiCall.json();
}
