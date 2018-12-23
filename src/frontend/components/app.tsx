
import { h, Component } from "preact";
import { Routes } from "./pages/routes";
//import Router from "preact-router";
import { Login } from "./login";
import { SetPassword } from "./setpassword";

export interface AppProps {
}

interface AppState {
  backgroundImage: string;
  authed: boolean;
}

export class App extends Component<AppProps, AppState> {
    routes: Routes = undefined as any;

    constructor(props: AppProps) {
        super(props);
        this.state = { 
            backgroundImage: "",
            authed: false
        };
    }

    async componentDidMount() {
        const bg = new Image();
        bg.src = "https://source.unsplash.com/daily?colorful";
        bg.onload = () => {
            this.setState({backgroundImage: bg.src});
        }
    }

    onAuth()
    {
        this.routes.loadRoutes();
        this.setState({authed: true})
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
                            <div className={state.authed ? "hidden" : "overlay"}>
                                <Login onAuth={this.onAuth.bind(this)}/>
                            </div>
                            <SetPassword />
                            <Routes path="/routes" ref={el => this.routes = el}/>
                        </div>
                    </div>
                </div>
        );
    }
}