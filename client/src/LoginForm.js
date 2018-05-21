import React, { Component } from 'react';
import { Glyphicon, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

var FieldGroup = ({ id, label, help, ...props }) => {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {/* {help && <HelpBlock>{help}</HelpBlock>} */}
      </FormGroup>
    );
  }

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            login: false
        }
    }
    
    handleUsernameChange = (event) => {
        let username = event.target.value;
        this.setState({
            username: username
        });
    }

    handlePasswordChange = (event) => {
        let password = event.target.value;
        this.setState({
            password: password
        });
    }

    handleLoginButton = () => {
        console.log('login', {
            username: this.state.username,
            password: this.state.password
        })
        fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(res => res.json())
        .then(res => {
            if(res.success)
                this.setState({
                    login: true
                })
            else
                this.setState({
                    login: false
                })
        })
    }

    render() {
        return (
            !this.state.login ?
            <div>
                <form>
                    <FieldGroup 
                        id="username"
                        type="text"
                        onChange = {this.handleUsernameChange}
                        value = {this.state.username === undefined ? '': this.state.username}
                    />
                    <FieldGroup 
                        id="password"
                        type="password"
                        onChange = {this.handlePasswordChange}
                        value = {this.state.password === undefined ? '': this.state.password}
                    />
                    <Button onClick={this.handleLoginButton}>
                        Login
                    </Button>
                </form>
            </div> 
            :
            <div>
                Login Success
            </div>
        )
    }
}

