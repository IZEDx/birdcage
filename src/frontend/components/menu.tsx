

import { h, Component } from "preact";
import { Link } from 'preact-router/match';

export interface MenuProps {
    onSizeToggle(): void;
    fullscreen: boolean;
}

interface MenuState {
}

export class Menu extends Component<MenuProps, MenuState> {

    
    renderItem(href: string, title: string, className = "") {
        return (
            <Link activeClassName="active" href={href}>
                <div className={`item ${className}`}>
                    {title}
                </div>
            </Link> 
        );
    }

    render() {
        return (
            <div className="menu">
                <div className="items">
                    <a onClick={() => history.back()} className="back">
                        <i className="fa fa-angle-left"></i>
                    </a> 
                    { this.renderItem("/routes", "Routes") }
                </div>
                <div className="items right">
                    <a onClick={() => this.props.onSizeToggle()} className="fullscreen-toggle">
                        <i className={"fa fa-angle-" + (this.props.fullscreen ? "down" : "up")}></i>
                    </a> 
                </div>
            </div>
        );
    }
}