import React, {Component } from "react";
import BallotFactory from "./contracts/BallotFactory.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Header from "./HeaderComponent.js"
import NewBallot from "./NewBallot";
import RenderElections from "./RenderElections";
import MetamaskAlert from "./MetamaskAlert";
import { BrowserRouter, Switch,Route, Redirect} from "react-router-dom";
import { Container } from "reactstrap";

class App extends Component{
  
  state = {
    web3: '', 
    accounts: [], 
    contract: '',
    elections:[],
    metamaskInstalled: false
  }

  async componentDidMount(){
    try {
      const metamaskInstalled = typeof(window.web3) !== 'undefined' ;
      this.setState({metamaskInstalled});
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BallotFactory.networks[networkId];

      const instance =  new web3.eth.Contract(
        BallotFactory.abi,
        deployedNetwork && deployedNetwork.address
      );
      const elections = await instance.methods.getAllElections().call();
      this.setState({contract: instance, accounts, elections, web3});

    } catch (error){
      console.log(error)
    }
  }

render () { 

  const ElectionsList = this.state.elections.map((address, i) =>{
        return <RenderElections key={i} election={address} />
    })

    if (!this.state.metamaskInstalled) {
      return (<MetamaskAlert />)
    }else{

  return(
    <BrowserRouter>
      <div className="app">
        <Container>
          <Header /><br/>
          <Switch>
              <Route exact path="/" component={() => ElectionsList}/>
              <Route path="/newpoll" component={NewBallot} />
          </Switch>
        </Container>
        </div>
    </BrowserRouter>
    )
   }
}
}

export default App;