import {NEBULA_CHALLENGES_URL} from "../constants";

export type Challenge = {
    recordId: string;
    namespace: string;
    userId: string;
    challenge: {
        challengeId: string;
        namespace: string;
        name: string;
        description: string;
        prerequisite: {
            stats: { statCode: string; value?: number; }[];
            items: never[];
            completedChallengeIds: { challengeId: string; isCompleted?: boolean; }[];
        };
        objective: {
            stats: { statCode: string; value: number; }[];
        };
        reward: {
            rewardId: string;
            stats: { statCode: string; value: number; }[]
            items: never[];
        };
        tags: string[];
        orderNo: number;
        createdAt: string;
        updatedAt: string;
        isActive: boolean;
    };
    progress: {
        prerequisite: {
            stats: never[];
            items: never[];
            completedChallengeIds: { challengeId: string; isCompleted: boolean; }[];
        };
        objective: {
            stats: { statCode: string; currentValue: number; targetValue: number; }[];
        };
    };
    updatedAt: string;
    status: string;
    isActive: boolean;
}

export async function getChallenges(accessToken: string): Promise<Challenge[]> {
    const apiCall = await fetch(
        NEBULA_CHALLENGES_URL,
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

    return ((await apiCall.json()) as { data: Challenge[] }).data;
}