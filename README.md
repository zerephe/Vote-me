# Voting app :: Smart Contract
This is just an example of simple voting app. Written with Solidity, Hardhat framework.

## Installation 

**Before compiling, install required plugins and framework in project folder:**

Run:
```shell
npm install
```
This installs all dependencies from 'package.json'

## Usage Votes.sol

**Deploy**

On testnet Rinkeby:
```shell
npx hardhat run scripts/deploy_contract.js --network rinkeby
```
Change `rinkeby` to `localhost` in order to deploy on local host.


Without network:
```shell
npx hardhat run scripts/deploy_contract.js
```

## Tasks

To get tasks list, run this in terminal:
```shell
npx hardhat 
```

Add vote:
```shell
npx hardhat addVote --vote-id 'ID for testing from 0-10..000' --network rinkeby
```

Vote for someone:
```shell
npx hardhat voteFor --vote-id 'ID for testing from 0-10..000' --candidate-address 'address' --network rinkeby
```

Finish specific vote by ID:
```shell
npx hardhat finishVote --vote-id 'ID for testing from 0-10..000' --network rinkeby
```

Withdraw fee:
```shell
npx hardhat withdrawFee --recipient-address 'recipient address' --withdraw-amount 'amount in uint' --network rinkeby
```

Get list of voters by ID:
```shell
npx hardhat getVoters --vote-id 'ID for testing from 0-10..000' --network rinkeby
```

Get list of candidates by ID:
```shell
npx hardhat getCandidates --vote-id 'ID for testing from 0-10..000' --network rinkeby
```

Get timestamp of vote by ID:
```shell
npx hardhat getTimeStamp --vote-id 'ID for testing from 0-10..000' --network rinkeby
```

Get winner of vote by ID:
```shell
npx hardhat getWinner --vote-id 'ID for testing from 0-10..000' --network rinkeby
```

Get vote count:
```shell
npx hardhat getVoteCount --network rinkeby
```

Use without `--network rinkeby` in order to run task locally.

## Licence
MIT
