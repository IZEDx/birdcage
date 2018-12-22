
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";
import { Routes } from "./routes";
import { AddRoute } from "./addroute";

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
        this.setState({ routes: data });
    }

    async routeAdded(source: string, target: string)
    {
        this.setState({
            routes: [...this.state.routes, {source, target}]
        });
    }

    render(props: AppProps, state: AppState) {
        return (
            <section className="routesContainer">
                <Routes routes={this.state.routes}></Routes>
                <AddRoute routeAdded={this.routeAdded.bind(this)} />
            </section>
        );
    }
}