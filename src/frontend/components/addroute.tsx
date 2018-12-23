
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";
import { Checkbox } from "./checkbox";

export interface AddRouteProps {
    onRouteAdded(route: Route): void;
}
interface AddRouteState {
    route: Route;
}
export class AddRoute extends Component<AddRouteProps, AddRouteState> {
    constructor(props: AddRouteProps) {
        super(props);
        this.state = {route: {
            source: "",
            target: "",
            ssl: false,
            email: ""
        }};
    }

    async onAdd()
    {
        const {data} = await api.post("/routes", this.state.route);
        if (data.success)
        {
            this.props.onRouteAdded(this.state.route);
        }
        else
        {
            alert(data.error);
        }
    }

    setRoute<K extends keyof Route>(key: K, value: Route[K])
    {
        this.setState({route: {...this.state.route, [key]: value}})
    }

    render(props: AddRouteProps, state: AddRouteState) {
        return (
            <div className="route add expanded">
                <div className="source">
                    <input type="text" placeholder="Source" onChange={(evt: any) => this.setRoute("source", evt.target.value)} />
                </div>
                <div className="target">
                    <input type="text" placeholder="Target" onChange={(evt: any) => this.setRoute("target", evt.target.value)} />
                </div>
                <div className="ssl">
                    <Checkbox label="HTTPS" checked={false} onChanged={checked => this.setRoute("ssl", checked)} />
                </div>
                <div className="email">
                    <input type="text" placeholder="Owner email" onChange={(evt: any) => this.setRoute("email", evt.target.value)} />
                </div>
                <button type="button" onClick={this.onAdd.bind(this)} className="btn addbtn">
                    <i className="fa fa-plus"></i>
                </button>
            </div>
        );
    }
}