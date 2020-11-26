import React, { useEffect, useState } from "react";
import BallotFactory from "./contracts/BallotFactory.json";
import  Ballot  from "./contracts/Ballot.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const App = () =>  {

  const [state, setState] = useState({web3: '', accounts: [], contract: ''})
  const [elections, setElections] = useState([]);
  
  useEffect(() => {

    const init = async() => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BallotFactory.networks[networkId];
        const instance = new web3.eth.Contract(
          BallotFactory.abi,
          deployedNetwork && deployedNetwork.address
        );

        setState({web3, accounts, contract: instance});
        renderElectionsList();
        console.log(state.contract)

      } catch(error) {

        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, []);

  const renderElectionsList = () => {
    var allElections = elections;
    if (allElections.length === 0) {return null}

    const totalElections = elections.length
    let electionsList = []
    var i
    for (i = 0; i < totalElections; i++) {
      let election = new state.web3.eth.Contract(Ballot.abi, elections[i]);
      electionsList.push(election)
      setElections(electionsList);
    }

    return(
      elections.map((election) => {
        return(
            <div>
                <h1>{election.description}</h1>
                <h2>{election.startDate}</h2>
                <h2>{election.endDate}</h2>
                {election.options.map( option => {
                  return(<h3>{option}</h3>)
                })}
            </div>
        )
      })
    )
}
}

export default App;
