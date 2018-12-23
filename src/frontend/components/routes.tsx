
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";
import { RouteEntry } from "./route";
import { AddRoute } from "./addroute";

export interface RoutesProps {
}
interface RoutesState {
    routes: Route[];
    input_source: string;
    input_target: string;
}
export class Routes extends Component<RoutesProps, RoutesState> {
    constructor(props: RoutesProps) {
        super(props);
        this.state = {
            routes: [],
            input_source: "",
            input_target: ""
        };
    }

    componentDidMount() {
        this.loadRoutes();
    }

    async loadRoutes()
    {
        const {data} = await api.get("/routes");
        this.setState({ routes: data });
    }

    async onAdd(route: Route)
    {
        this.setState({
            routes: [route, ...this.state.routes]
        });
    }

    async onDelete(route: Route)
    {
        const idx = this.state.routes.findIndex(r => r.source === route.source && r.target === route.target);
        if (idx >= 0)
        {
            this.state.routes.splice(idx, 1);
            this.setState({routes: this.state.routes});
        }
    }

    render(props: RoutesProps, state: RoutesState) {
        return (
            <div className="routes">
                <div className="routelist">
                    <AddRoute onRouteAdded={this.onAdd.bind(this)}/>
                    {this.state.routes.map(route => 
                        <RouteEntry route={route} onDeleted={this.onDelete.bind(this)}/>
                    )}
                </div>
            </div>
        );
    }
}