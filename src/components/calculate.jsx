import React, { Component } from 'react';
import NavBar from './shared/navbar';


class Calculate extends Component {
    costChangeHandler = (value) => {
        if (value){
            this.setState({showCost: value * 1.01});
        } else {
            this.setState({showCost: 0});
        }
    }

    state = { 
        showCost: 0
    }

    render() {
        return (
            <React.Fragment>
                <NavBar links={
                    [
                        {text: 'Home', url: '/home', selected: false},
                        {text: 'Profile', url: '/profile', selected: false},
                        {text: 'Logout', url: '/logout', selected: false}
                    ]
                } />
                <div className="form-block">
                    <h2>The Cost of New Credit</h2>
                    <input onChange={ (e) => this.costChangeHandler(e.target.value.replace(/[^A-Za-z-0-9\s]/g,'')) } className="input" type="number" placeholder="Enter Amount"/><br/><br/>
                    <input value={ this.state.showCost === 0 ? '' : this.state.showCost } placeholder="Total Cost" className="input" type="number" disabled/><br/><br/>
                </div>
            </React.Fragment>
        );
    }
}
 
export default Calculate;