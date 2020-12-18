import React, {Component  } from "react";
import {Navbar, Nav, NavbarToggler, NavItem, Collapse} from "reactstrap";
import { NavLink } from "react-router-dom";

class Header extends Component{

    state = {
        navbarIsOpen: false,
    }

    toggleNavbar = () => {
        this.setState({navbarIsOpen: !this.state.navbarIsOpen} )
    }

    render(){
        return(
            <React.Fragment>
                <Navbar dark expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNavbar} />
                        <Collapse navbar isOpen={this.state.navbarIsOpen}>
                        <Nav navbar >
                            <NavItem>
                                <NavLink className="nav-link" to="/home">
                                    Home
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink className="nav-link" to="/newpoll" >
                                    New poll
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    </div>
                </Navbar>
            </React.Fragment>
        )
    }
}

export default Header;