import React, {Component} from "react";
import  Ballot  from "./contracts/Ballot.json";
import getWeb3 from "./getWeb3";
import { loadWeb3 } from "./init";
import { CardTitle, CardText, Card,Col,Button, Row } from "reactstrap";
import moment from "moment";

class RenderElections extends Component{

    state = {
        proposals: [],
        description: '',
        startDate: '',
        endDate: '',
        selectedProposal: '',
        documentsHashes: [],
        proposalsCount: '',
        accounts: [],
        web3: '',
        contract: '',
        errorMessage: ''
    }

    componentDidMount = async () =>{
        try{
           
          loadWeb3();
          let web3 = window.web3;
          let currentUser = await web3.currentProvider.selectedAddress
                //const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const contract =  await new web3.eth.Contract(Ballot.abi, this.props.election);
                const description = await contract.methods.description().call();
                const start = await contract.methods.startDate().call();
                let d = new Date(start*1000);
                let toDate = d.getDate();
                let toMonth = d.getMonth();
                let toYear = d.getFullYear()
                let hours = d.getHours();
                let mins = d.getMinutes();  
                const startDate = toDate + ' / ' + toMonth + ' / ' + toYear + ' at ' + hours + ' : '+mins
                
                let end = await contract.methods.endDate().call();
                d = new Date(Number(end)*1000);
                toDate = d.getDate();
                toMonth = d.getMonth();
                toYear = d.getFullYear();
                hours = d.getHours();
                mins = d.getMinutes()
                const endDate = toDate + ' / '+ toMonth + ' / ' + toYear + ' at ' + hours + ' : '+mins
 
                const hashes = [];
                const proposalsList = [];
                const proposalsCount = await contract.methods.proposalsCount().call();
                for(let i = 1; i <= proposalsCount; i++){
                  const proposal = await contract.methods.proposals(i).call();
                  proposalsList.push(proposal)

                }
                
                //const proposals = await contract.methods.proposals().call();
                //const documentsHashes = await contract.methods.attachedDocs().call();
                this.setState({contract,accounts,proposals:proposalsList ,startDate,endDate,proposalsCount,description})
                //console.log(this.state)
        } catch (error) {
            console.log(error)
        }
    }

    handleSubmit = async (e, id) => {
        e.preventDefault();
        console.log(id)
        try {
            const response = await this.state.contract.methods.vote(id).send({from: this.state.accounts[0]})
            if(response){ 
              console.log(response)
              window.location.reload()
          }else{
            alert('You cannot vote more than once')
            
          }
        } catch (error) {
            this.setState({errorMessage: 'You either tried to vote twice or denied signing a transaction'})

        }
    }

    render(){

        const {errorMessage ,startDate,endDate, proposals,documentsHashes,description} = this.state;
       if(!errorMessage){
        return(
            <Col sm="10" >
              <Card body key={endDate}>
              <Row>
                <Col sm="5">
                    {
                      proposals ? proposals.map((prop, index) => 
                        <CardTitle key={index}>
                            <strong>Votes count for {prop.name}</strong> <span>: {prop.voteCount}</span> <br /> 
                            <Button 
                                color={prop.name === 'YES' ? 'success' : 'danger' }
                                type="submit" 
                                onClick={(e) => this.handleSubmit(e, index+=1)}
                            >A{prop.name}</Button>
                          </CardTitle>
                        ) : <div>Nothing</div>
                        }
                      </Col>
                    </Row>
                       <CardTitle><strong>Description:</strong> {description}</CardTitle>
                       <CardText><strong>Start date & time:</strong> {startDate}</CardText>
                       <CardText><strong>End date & time:</strong> {endDate}</CardText>
                      {/* <CardText>View attached documents: { documentsHashes ? documentsHashes.map((doc, i) => <div key={i}> {i+=1}. <a href="#"> {doc}</a> </div>): <div>NOthing</div>}</CardText> */}
                      <CardText><strong>Attached Documents: </strong></CardText>
                </Card> <br />
                </Col>
        )
      }else{
        alert(errorMessage)
        return(
          <Col sm="10">
            <Card body key={endDate}>
            <Row >
              <Col sm="5">
                  {
                    proposals ? proposals.map((prop, index) => 
                      <CardTitle key={index}>
                          Votes count for {prop.name} <span>: {prop.voteCount}</span> <br /> 
                          
                          <Button 
                              color={prop.name === 'YES' ? 'success' : 'danger' }
                              type="submit" 
                              onClick={(e) => this.handleSubmit(e, index+=1)}
                          >A{prop.name}</Button>
                        </CardTitle>
                      ) : <div>Nothing</div>
                      }
                    </Col>
                  </Row>
                     <CardTitle>Election description: {description}</CardTitle>
                     <CardText>Start date & time: {startDate}</CardText>
                     <CardText>End date & time: {endDate}</CardText>
                    {/* <CardText>View attached documents: { documentsHashes ? documentsHashes.map((doc, i) => <div key={i}> {i+=1}. <a href="#"> {doc}</a> </div>): <div>NOthing</div>}</CardText> */}
              </Card> <br />
              </Col>
      )
      }       
    }
}

export default RenderElections;