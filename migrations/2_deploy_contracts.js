var BallotFactory = artifacts.require("BallotFactory.sol");
var Ballot = artifacts.require("Ballot.sol");


module.exports = async function(deployer, _network, accounts) {
  await deployer.deploy(BallotFactory, {from: accounts[0]});
  const ballotFactory = await BallotFactory.deployed();

  await ballotFactory.createElection(
    ['YES','NO'], 
    'A test ballot for the blockchain smart contract voting', 
    web3.utils.soliditySha3('first file'), 
    1608717350,
    1609322150,
    {from:accounts[0]}
  );

  await ballotFactory.createElection(
    ['YES','NO'], 
    'Another test ballot to illustrate blockchain smart contract voting', 
    web3.utils.soliditySha3('another file'), 
    1610272550,
    1615802150,
    {from:accounts[0]}
  );

  await ballotFactory.createElection(
    ['YES','NO'], 
    'A simple ballot to demontrate blockchain capabilities of avoiding electoral fraud',
    web3.utils.soliditySha3('Any files can go here'), 
    1618480550,
    1621072550,
    {from:accounts[0]}
  );
  
  const results = await ballotFactory.getAllElections();
  const ballot = await Ballot.at(results[0]);
  for(let b = 0; b < results.length; b++){
    const ballot = await Ballot.at(results[b]);
    for(let i =1; i < accounts.length; i++){
      await ballot.giveRightToVote(accounts[i]);
    }
  }
};