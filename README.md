## Description

Test project for getting balance and transferring ERC20 standard tokens 

## Installation

1. Clone the repo then run

```bash
$ npm install
```
2. Assuming you don't want to use real blockchain for testing you need to run fork blockchain locally in separate terminal window:

Fill your .env file with needed variables as it describes in .env.example:

| Const    | Type   | Description                      |
| -------- | ------ | ---------------------------------|
| RPC_URL  | string | Local blockchain hardhat RPC     |
| RPC_FORK | string | RPC to fork                      |
| CHAIN_ID | string | Chain ID (hardhat standard 31337)|

Than run

```bash
$ npx hardhat node
```

3. If you want to test in real network use real RPC endpoint in RPC_URL, and corresponding CHAIN_ID. I that case you can leave RPC_FORK empty and not run ``` npx hardhat node ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

4. To test API of project use any suitable app, for example POSTMAN:

  a. GET: http://localhost:3000/balance/{{token_addr}}/{{user_addr}}

  b. POST: http://localhost:3000/
  
    - Header: {Authorization: "Bearer {{secretKey}}"}
    - Body: {
      "token_addr": {{token_addr}},
      "user_addr": {{user_addr}},
      "recipient_addr": {{recipient_addr}},
      "amount": {{amount}}
      }

## Test

```bash
# unit tests
$ npm run test

