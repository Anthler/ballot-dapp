import React, {Component} from "react";
import  Ballot  from "./contracts/Ballot.json";
import getWeb3 from "./getWeb3";
//import { loadWeb3 } from "./init";
import { CardTitle, CardText, Card,Col,Button, Row } from "reactstrap";

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
        web3: ''
    }

    componentWillMount = async () =>{

        let electionsProps = await this.props.election;
        try{
            if(electionsProps){

                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const contract =  await new web3.eth.Contract(Ballot.abi, this.props.election);
                const description = await contract.methods.description().call();
                const start = await contract.methods.startDate().call();
                let d = new Date(Number(start)*1000);
                let toDate = d.getDate();
                let toMonth = d.getMonth();
                let toYear = d.getFullYear();
                let hours = d.getHours();
                let mins = d.getMinutes();  
                const startDate = toDate + ' / '+ toMonth + ' / ' + toYear
                
                let end = await contract.methods.endDate().call();
                d = new Date(Number(end)*1000);
                toDate = d.getDate();
                toMonth = d.getMonth();
                toYear = d.getFullYear();
                hours = d.getHours();
                mins = d.getMinutes()
                const endDate = toDate + ' / '+ toMonth + ' / ' + toYear + ' at ' + hours + ' : '+mins
 
                const proposalsCount = await contract.methods.proposalsCount().call();
                const proposals = await contract.methods.proposals().call();
                const documentsHashes = await contract.methods.attachedDocs().call();
                this.setState({contract,accounts,startDate,endDate,proposalsCount, proposals,documentsHashes,description})
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleSubmit = async (e, id, index) => {
        e.preventDefault();
        console.log(this.state.elections[index])
        try {
            const response = await this.state.elections[index].methods.vote(id).send({from: this.state.accounts[0]})
            if(response) console.log('voted')
        } catch (error) {
            console.log(error)
        }
    }

    render(){

        const {contract,accounts,startDate,endDate,proposalsCount, proposals,documentsHashes,description} = this.state;

        return(
            <Col sm="10">
              <Card body key={endDate}>
              <Row>
                <Col sm="5">
                    {
                      proposals ? proposals.map(({name, votes}, index) => <div>
                        <CardTitle key={index}>
                            Votes count for {name} <span>: {votes}</span> <br /> 
                            
                            <Button 
                                color="success" 
                                type="submit" 
                                onClick={(e) => this.handleSubmit(e, index+=1)}
                            >VOTE {name}</Button>
                          </CardTitle>
                        </div>) : <div>Nothing</div>
                        }
                      </Col>
                    </Row>
                       <CardTitle>Election description: {description}</CardTitle>
                       <CardText>Start date & time: {startDate}</CardText>
                       <CardText>End date & time: {endDate}</CardText>
                      <CardText>View attached documents: { documentsHashes ? documentsHashes.map((doc, i) => <div key={i}> {i+=1}. <a href="#"> {doc}</a> </div>): <div>NOthing</div>}</CardText>
                </Card> <br />
                </Col>
        )        
    }
}

export default RenderElections;