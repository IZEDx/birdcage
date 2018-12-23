
import { h, Component } from "preact";
import { Routes } from "./pages/routes";
//import Router from "preact-router";
import { Menu } from "./menu";

export interface AppProps {
}

interface AppState {
  backgroundImage: string;
}

export class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { 
            backgroundImage: ""
        };
    }

    async componentDidMount() {
        const bg = new Image();
        bg.src = "https://source.unsplash.com/daily?himalaya";
        bg.onload = () => {
            this.setState({backgroundImage: bg.src});
        }
    }

    render(props: AppProps, state: AppState) {
        return (
                <div className="app-container">
                    <div 
                        className={`app-background ${this.state.backgroundImage === "" ? "" : "visible"}`} 
                        style={{"backgroundImage": `url(${this.state.backgroundImage})`}} 
                    />
                    <div className="app">
                        <div className="header">
                            <span className="logo" />
                            Birdcage
                        </div>
                        <div className="body">
                            <Routes path="/routes" />
                        </div>
                    </div>
                </div>
        );
    }
}