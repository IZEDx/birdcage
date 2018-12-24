
import { h, Component } from "preact";
import { Routes } from "./routes";
//import Router from "preact-router";
import { Login } from "./login";
import { SetPassword } from "./setpassword";
import { api } from "../api";

export interface AppProps {
}

interface AppState {
  backgroundImage: string;
  authed: boolean;
  settings: boolean;
}

export class App extends Component<AppProps, AppState> {
    routes: Routes = undefined as any;

    constructor(props: AppProps) {
        super(props);
        this.state = { 
            backgroundImage: "",
            authed: false,
            settings: false
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

    toggleSettings()
    {
        this.setState({settings: !this.state.settings});
    }

    
    async onLogout()
    {
        const {data} = await api.delete("/auth");
        if (data.success)
        {
            location.reload(true);
        }
        else
        {
            alert(data.error);
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
                            {!state.authed ? "" : 
                                <div className="right">
                                    <button type="button" onClick={this.toggleSettings.bind(this)} className="btn settings">
                                        <i className="fa fa-gear"></i>
                                    </button>
                                    <button type="button" onClick={this.onLogout.bind(this)} className="btn logout">
                                        <i className="fa fa-sign-out"></i>
                                    </button>
                                </div>
                            }                            
                        </div>
                        <div className="body">
                            <Routes path="/routes" ref={el => this.routes = el}/>
                            <div className={state.settings ? "overlay" : "hidden"}>
                                <SetPassword onChanged={this.toggleSettings.bind(this)}/>
                            </div>
                            <div className={state.authed ? "hidden" : "overlay"}>
                                <Login onAuth={this.onAuth.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}