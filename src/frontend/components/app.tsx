
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";
import { Routes } from "./routes";

export interface AppProps {
}
interface AppState {
  routes: Route[];
}
export class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { 
            routes: [] 
        };
    }

    async componentDidMount() {
        const {data} = await api.get("/routes");
        console.log(data);
        console.log(await (await fetch("./api/routes")).text());
        this.setState({ routes: data });
    }

    render(props: AppProps, state: AppState) {
        return <Routes routes={this.state.routes}></Routes>;
    }
}