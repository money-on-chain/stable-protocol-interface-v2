# Stable Protocol Interface v2

## Warning: This is only for version 2 of the main contracts.

Open source **decentralized interface** for v2 contracts

You can:

* Mint / Redeem Pegged Token (TP): Ex.: GoARS, USDRIF
* Mint / Redeem Collateral Token (TC): Ex.: GoTurbo, RIFPro
* Metrics
* Last operations


### Projects and tokens 

**Projects**

* Please review the contracts [here](https://github.com/money-on-chain/main-sc-protocol)


| Token    | Token name       | Project | Token Name | Collateral |
|----------|------------------|---------|------------|------------|
| TP #0    | Pegged Token     | Flipago | Go ARS     | DoC        |
| TP #1    | Pegged Token     | Flipago | Go MXN     | DoC        |
| TC       | Collateral Token | Flipago | Go Turbo   | DoC        |
| FeeToken | Fee Token        | Flipago | Flip       | -          |
| TP       | Pegged Token     | RoC     | USDRIF     | RIF        |
| TC       | Collateral Token | RoC     | RIFP       | RIF        |
| FeeToken | Fee Token        | RoC     | MOC        | -          |



### Releases

Each release gets deployed to IPFS automatically.

Please go to release section, there are several links to [releases](https://github.com/money-on-chain/release) 

**Notes:** The list of operations of the user is get it through an  API. We use an api also for the liquidity mining program, but is not need it to run or to exchange tokens.


## DEVELOP

### Setup: Running develop

Requires:

* Nodejs > 14

Install nodejs

`nvm use`

Install packages

`npm install`

Run

`npm run start:flipago-testnet`

or 

`npm run start:roc-testnet`

**Note:** Start the environment you want to run ex. **"start:flipago-testnet"** to start environment Flipago Testnet 


### Environment table

Environment is our already deployed contracts. 
**Develop**: npm run start:<environment>

| Name            | Project | Main Gateway                         | Environment | Network | npm run               |
|-----------------|---------|--------------------------------------|-------------|---------|-----------------------|
| Flipago Testnet | MOC     | [link](https://www.moneyonchain.com) | Testnet     | RSK     | start:flipago-testnet |
| RoC Testnet     | MOC     | [link](https://www.moneyonchain.com) | Testnet     | RSK     | start:roc-testnet     |



### Faucets

In testnet you may need some test tRIF o tRBTC

* **Faucet tRBTC**: https://faucet.rsk.co/
* **Faucet tRIF**: https://faucet.rifos.org/


### Integration

If you want to integrate Money on Chain protocols please review our Integration repository:  [https://github.com/money-on-chain/stable-protocol-backend-v2](https://github.com/money-on-chain/stable-protocol-backend-v2)
