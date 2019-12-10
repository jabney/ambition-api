# ambition-api
A JWT-based NodeJS/Express/MongoDB API written in TypeScript using Mongoose

## Environment

```bash
export NODE_DEBUG=ambition:*
export PORT=4500
export TRUST_PROXY=1
export ALLOW_UNSECURE=false
export MONGODB_URL='mongodb://localhost:27017/ambition'

export JWT_SECRET='racecar red'
export JTW_ISSUER=http://localhost
export JWT_AUDIENCE=http://localhost/users
export JWT_EXPIRES_IN_DAYS=7

export PASSWORD_COST_FACTOR=10
```

## Routes

### `/auth`

#### `/auth/signup POST`: register a new user

request headers:

```
authorization: Bearer <api key>
```

request body:

`Content-Type` : `application/json`

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

#### `/auth/signin POST`: log a user in

request headers:

```
authorization: Bearer <api key>
```

request body:

`Content-Type` : `application/json`

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

#### `/auth/signout GET`: log a user out (revoke token)

request headers:

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/auth/signout/all GET`: log a user out of all devices (revoke all tokens)

Responses:
- 200 Successful

### `/user`

#### `/user GET` fetch the user profile

request headers:

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

#### `/user PATCH` update user profile

request headers:

```
authorization: Bearer <access token>
```

request body:

`Content-Type` : `application/json`

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

#### `/user DELETE` delete a user and all associated data

request headers:

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/user/grants GET` get the current user's grants

request headers:

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

#### `/user/grants POST` add a grant to the current user

request headers:

```
authorization: Bearer <access token>
```

request body:

`Content-Type` : `application/json`

```typescript
{
  grant: string
}
```

Responses:
- 200 Successful

#### `/user/grants DELETE` remove a grant from the current user

request headers:

```
authorization: Bearer <access token>
```

request body:

`Content-Type` : `application/json`

```typescript
{
  grant: string
}
```

Responses:
- 200 Successful

### `/grants`

#### `/grants GET` fetch a list of available grants and their descriptions

request headers:

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

#### `/admin/whitelist GET` get a list of whitelisted email addresses

request headers:

```
authorization: Bearer <access token>
```

Responses:
- 200 Successful

#### `/admin/whitelist POST` add an email address to the whitelist

request headers:

```
authorization: Bearer <access token>
```

request body:

`Content-Type` : `application/json`

Responses:
- 200 Successful

  ```typescript
  {
    email: string
  }
  ```

#### `/admin/whitelist DELETE` remove an email address from the whitelist

request headers:

```
authorization: Bearer <access token>
```

request body:

`Content-Type` : `application/json`

Responses:
- 200 Successful

  ```typescript
  {
    email: string
  }
  ```
