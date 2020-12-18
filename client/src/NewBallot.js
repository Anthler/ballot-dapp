import React, { Component,useEffect, useState } from "react";
import BallotFactory from "./contracts/BallotFactory.json";
import getWeb3 from "./getWeb3";
import { Form, FormGroup, Label, Input, FormText, Container } from 'reactstrap';
import "./App.css";

class NewBallot extends Component {

  state = {
      web3: '', 
      accounts: [], 
      contract: '', 
      description: '', 
      options:[],
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      files: '',
      errorMessage: ''
    }
  
    componentDidMount = async() => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BallotFactory.networks[networkId];
        const instance = new web3.eth.Contract(
          BallotFactory.abi,
          deployedNetwork && deployedNetwork.address
        );
        this.setState({web3, accounts, contract: instance});
      } catch(error) {

        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }


  handleSubmit = async (event) => {
    event.preventDefault();
    const {options, description, files, startDate, startTime, endDate, endTime, accounts} = this.state;
    console.log(options)
    let startDateTimestamp = Date.parse(startDate)
    let endDateTimestamp = Date.parse(endDate)
    const fileHashes = await this.state.web3.utils.soliditySha3(files)
    
    try {
      const response = await this.state.contract.methods.createElection(
        options, 
        description, 
        fileHashes,
        startDateTimestamp,
        endDateTimestamp
      ).send({from: accounts[0]});
  
      if(response){
        alert('created successfully')
        this.setState({option: [], description: '', files: '', startDate: '', startTime: '', endDate: '', endTime: ''})
      }
    } catch (error) {
        this.setState({errorMessage: 'You are not authorized to perform this action'})
    }
    
}

handleInputChange = (event) => {
    
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
}

handleMultiSelect = (e) =>{
  let value = Array.from(e.target.selectedOptions, option => option.value);
  this.setState({options: value})
}

// handleFilesUpload = (e) => {
//   let files = e.target.files;
//   let value = Array.from(files, )
//   for (let i = 0; i < files.length; i++) {
//     formData.append(`images[${i}]`, files[i])
//   }
// }


render(){
  if(!this.state.errorMessage){
    return(
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="exampleDate">Start Date</Label>
            <Input
              type="date"
              name="startDate"
              id="exampleDate"
              placeholder=" start date"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          {/* <FormGroup>
            <Label for="exampleTime">Start Time</Label>
            <Input
              type="time"
              name="startTime"
              id="exampleTime"
              placeholder="start time"
              onChange={this.handleInputChange}
            />
          </FormGroup> */}
  
          <FormGroup>
            <Label for="exampleDate">End Date</Label>
            <Input
              type="date"
              name="endDate"
              id="exampleDate"
              placeholder="date placeholder"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          {/* <FormGroup>
            <Label for="exampleTime">End Time</Label>
            <Input
              type="time"
              name="endTime"
              id="exampleTime"
              placeholder="end time"
              onChange={this.handleInputChange}
            />
          </FormGroup> */}
          <FormGroup>
            <Label for="exampleSelectMulti">Select Multiple</Label>
            <Input
              type="select"
              name="options"
              id="exampleSelectMulti"
              multiple
              onChange={this.handleMultiSelect}
            >
              <option>YES</option>
              <option>NO</option>
              {/* <option>NOT SURE</option>
              <option>UNDECIDED</option> */}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="exampleText">Description</Label>
            <Input type="textarea" name="description" id="exampleText" onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="exampleFile">File</Label>
            <Input type="file" name="files" id="exampleFile" onChange={this.handleInputChange} />
            <FormText color="muted">
              select attached documents
            </FormText>
          </FormGroup>
          <button type="submit">Create</button>
        </Form>
        </Container>
      );
  }else{
    return(
      <h1> {this.state.errorMessage} </h1>
    )
  }
  }

}

export default NewBallot;
