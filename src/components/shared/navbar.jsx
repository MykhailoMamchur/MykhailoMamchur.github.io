import React, { Component } from 'react';
import { Link } from "react-router-dom";

class NavBar extends Component {
    render() {
        const { links } = this.props; 
        
        return (
            <header>
                <h2 className="logo">CreditGains</h2>
                <nav className="navbar-home">
                    <ul>
                        {links.map((elem, i) => {
                            return (
                            <li key={i}>
                                <Link className={elem.selected ? "a-selected": ""} to={elem.url}>{elem.text}</Link>
                            </li>
                            )
                        })}
                    </ul>
                </nav>
            </header>
        );
    }
}
 
export default NavBar;