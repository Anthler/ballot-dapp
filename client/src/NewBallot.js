import React, { useEffect, useState } from "react";
import BallotFactory from "./contracts/BallotFactory.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const NewBallot = () =>  {

  const [state, setState] = useState({
      web3: '', 
      accounts: [], 
      contract: '', 
      description: '', 
      options:[],
      startDate: '',
      endDate: ''
    })
  
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
        console.log(accounts)

      } catch(error) {

        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, []);

  const handleSubmit = async () =>{
      const {options, description, startDate, endDate} = state;
      try {
            const response = await state.contract.methods.createBallot(options, description, startDate, endDate).send({from: accounts[0]});
            setState({description: '', options: [], startDate:'', endDate:''});
      } catch (error) {
           console.log(error)
      }
  }

  return(
    <div>
      <section>
        <h2>Hello World</h2>
      </section>
      <form onSubmit={handleSubmit}>
          <input type='text' onChange={(e) => setState({description:e.target.value})}/>
          <button>Submit</button>
      </form>
    </div>
  )

}

export default NewBallot;
