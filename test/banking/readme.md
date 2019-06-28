# ms-banking

## Tables
- `ma_balance` (`SELECT`, `UPDATE`)
- `ma_withdrawal` (`SELECT`, `INSERT`)
- `ma_deposits` (`SELECT`, `INSERT`)
- `ma_request_keys` (`SELECT`, `REPLACE`)
- `ma_blocked_wallets` (`SELECT`)
- `ma_domains` (`SELECT`)
- `ma_users` (`SELECT`)
- `ma_users_meta` (`SELECT`)

## Routes

`/balance/get`

parameters: `{ userId }`

returns: 
```js
[{
  currency: String, 
  balance: Number 
}]
```


### `/withdrawal/history`

parameters: `{ userId }`

returning value: user's withdrawals sorted by time

### `/withdrawal/get`

parameters: `{ userId, data: { id } }`

returning value: withdrawal


### `/withdrawal/create`

parameters:
```js
{
  amount: Number,
  wallet: String,
  payment_system: String,
  currency: String
}
```
returns: `{ email }` (user's email) 


### `/withdrawal/confirm`
###### It sends withdrawal confirmation code to user

parameters:
```
{
  code: Number, // code from withdrawal confirmation
}
```
returns: `{ error: false }`

### `/deposit/create-request`

parameters:
```js
{
  paymentType: String
}
```
returns: `{ text }` or `{ redirectUrl }`

### `/deposit/create`

parameters:
```js
{
  amount: Number,
  wallet: String,
  paymentType: String,
  currency: String
}
```
returns:
```js
{
  id, // deposit id
  apiResponse,
  amount,
  user_id,
  paymentType,
  currency
}
```

### `/deposit/request`

parameters:
```js
{
  h // request hash
}
```
returns: deposit redirect template

### `/transfer/create`

parameters:
```js
{
  targetEmail: String,
  amount: Number
  currency: String
}
```
returns: `{ email }` (sender's email) 

### `/transfer/confirm`
###### It sends transfer confirmation with code to sender

parameters:

`{ code: Number // code from confirmation }`

returns:

### `/methods/payment`

returns: payment methods map

### `/methods/withdrawal`

returns: withdrawal methods map

### `/convert/create`

parameters:
```js
{
  amount: Number,
  senderCurrency: String,
  receiverCurrency: String,
}
```

returns: `{ amount: Number, email: string }`

### `/convert/confirm`

parameters: `{ code: Number }`

returns: `{ error: false }`
