# ambition-api
A JWT-based NodeJS/Express/Mongoose API written in TypeScript

## Environment

```bash
export NODE_DEBUG=ambition:*
export PORT=4500
export TRUST_PROXY=1
export ALLOW_UNSECURE=false
export MONGODB_URI='mongodb://localhost:27017/ambition'

export JWT_SECRET='racecar red'
export JTW_ISSUER=http://localhost
export JWT_AUDIENCE=http://localhost/users
export JWT_EXPIRES_IN_DAYS=7

export PASSWORD_COST_FACTOR=10
```

## Routes

- [`/auth`](#auth)
  - [`/auth/signup POST`](#authsignup-post)
  - [`/auth/signin POST`](#authsignin-post)
  - [`/auth/signout GET`](#authsignout-get)
  - [`/auth/signout/all GET`](#authsignoutall-get)

- [`/user`](#user)
  - [`/user GET`](#user-get)
  - [`/user PATCH`](#user-get)
  - [`/user DELETE`](#user-get)
  - [`/user/settings GET`](#usersettings-get)
  - [`/user/settings POST`](#usersettings-post)
  - [`/user/settings DELETE`](#usersettings-delete)
  - [`/user/grants GET`](#usergrants-get)
  - [`/user/grants POST`](#usergrants-post)
  - [`/user/grants DELETE`](#usergrants-delete)

- [`/admin`](#admin)
  - [`/admin/whitelist GET`](#adminwhitelist-get)
  - [`/admin/whitelist POST`](#adminwhitelist-post)
  - [`/admin/whitelist DELETE`](#adminwhitelist-delete)
  - [`/admin/tokens DELETE`](#admintokens-delete)
  - [`/admin/tokens/all DELETE`](#admintokensall-delete)

### `/auth`

#### `/auth/signup POST`

Register a new user.

_request headers:_

```
authorization: Bearer <api key>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  email: string
  password: string
  first?: string
  last?: string
}
```

Responses:
- 200 Successful

  ```typescript
  {
    token: <access token>
  }
  ```

- 409 User already exists
- 422 Input validation error

#### `/auth/signin POST`

Log a user in.

_request headers:_

```
authorization: Bearer <api key>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  email: string
  password: string
}
```

Responses:
- 200 Successful

  ```typescript
  {
    token: <access token>
  }
  ```

- 404 User not found
- 422 Input validation error

#### `/auth/signout GET`

Log a user out (revoke token).

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/auth/signout/all GET`

Log a user out of all devices (revoke all tokens)

Responses:
- 200 Successful

### `/user`

#### `/user GET`

Fetch the user profile.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

  ```typescript
  {
    _id: string
    email: string
    first: string
    last: string
    roles: string[]
    grants: string[]
  }
  ```

#### `/user PATCH`

Update the user profile.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  email?: string
  password?: string
  first?: string
  last?: string
}
```

Responses:
- 200 Successful
- 422 Input validation error

#### `/user DELETE`

Delete a user and all associated data.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/user/settings GET`

Get the current user's settings.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

  ```typescript
  {
    ... // A plain old javascript object
  }
  ```

#### `/user/settings POST`

Update the current user's settings.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  settings: {...} // A plain old javascript object
}
```

Responses:
- 200 Successful
- 422 Input validation error

#### `/user/settings DELETE`

Delete the current user's settings.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/user/grants GET`

Get the current user's grants.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

  ```typescript
  {
    grants: string[]
  }
  ```

#### `/user/grants POST`

Add a grant to the current user.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  grant: string
}
```

Responses:
- 200 Successful

#### `/user/grants DELETE`

Remove a grant from the current user.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  grant: string
}
```

Responses:
- 200 Successful

### `/grants`

#### `/grants GET`

Fetch a list of available grants and their descriptions.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

  ```typescript
  {
    grants: [
      {
        type: string
        description: string
      },
    ]
  }
  ```

### `/admin`

#### `/admin/whitelist GET`

Get a list of whitelisted email addresses.

_request headers:_

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/admin/whitelist POST`

Add an email address to the whitelist.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  email: string
}
```

Responses:
- 200 Successful

#### `/admin/whitelist DELETE`

Remove an email address from the whitelist.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  email: string
}
```

Responses:
- 200 Successful

  ```typescript
  {
    email: string
  }
  ```

#### `/admin/tokens DELETE`

Delete tokens for a user.

This action logs a user out across all devices.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  email: string
  // or
  userId: string
}
```

Responses:
- 200 Successful
- 400 email or userId not specified
- 404 user not found

#### `/admin/tokens/all DELETE`

Delete all tokens from the db.

This action logs all users out accross all devices.

_request headers:_

```
authorization: Bearer <access token>
```

_request body:_

```
Content-Type: application/json
```

```typescript
{
  confirm: boolean // true to delete all tokens
}
```

Responses:
- 200 Successful
- 400 could not confirm
