# @dennisrijsdijk/nebula

> Read-only Starbreeze Nebula API Client for NodeJS 

## Install

```
$ npm install @dennisrijsdijk/nebula
```

## Usage

```ts
import {AuthContainer, AuthData, ApiClient} from "@dennisrijsdijk/nebula";

const auth: AuthContainer = new AuthContainer(async (data: AuthData) => {
    // Store the authData to a file.
});

try {
    await auth.loginWithCredentials("username", "password");
} catch (error) {
    console.error(error);
    process.exit(1);
}

const apiClient: ApiClient = new ApiClient(auth);

try {
    console.log(`balance: $${(await apiClient.getCash()).balance}`);
} catch (error) {
    console.error(error);
    process.exit(1);
}
```

## API

### new AuthContainer(refreshCallback)

#### refreshCallback

Type: `(data: AuthData) => void | Promise<void>`

Token Refresh Callback. Used to provide updated tokens to store to disk.

### authContainer.loginWithToken(refreshToken)

Type: `Promise<void>`

**throws**

Login to Nebula API with a Refresh Token.

#### refreshToken

Type: `string`

### authContainer.loginWithCredentials(username, password)

Type: `Promise<void>`

**throws**

Login to Nebula API with a username & password.

#### username

Type: `string`

#### password

Type: `string`

### authContainer.refresh(force)

Type: `Promise<boolean>`

**throws**

Refresh the currently active token. Returns true if refreshed, false otherwise.

#### force

Type: `boolean`

Default: `false`

Force the refresh. When false, refresh only happens if the accessToken is expired.

### new ApiClient(authContainer)

#### authContainer

Type: `AuthContainer`

### apiClient.getChallenges()

Type: `Promise<Challenge[]>`

**throws**

### apiClient.getUser()

Type: `Promise<User>`

**throws**

### apiClient.getUserSaveData()

Type: `Promise<any>`

**throws**

### apiClient.getCash()

Type: `Promise<Wallet>`

**throws**

### apiClient.getStacks()

Type: `Promise<Wallet>`

**throws**

### apiClient.getPremiumCurrency()

Type: `Promise<Wallet>`

**throws**

### apiClient.getAllCurrency()

Type: `Promise<{cash: Wallet; stacks: Wallet; premium: Wallet;}>`

**throws**
