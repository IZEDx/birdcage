
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";

export interface AddRouteProps {
    routeAdded: (source: string, target: string) => any;
}
interface AddRouteState {
    source: string,
    target: string
}
export class AddRoute extends Component<AddRouteProps, AddRouteState> {
    constructor(props: AddRouteProps) {
        super(props);
        this.state = {
            source: "",
            target: ""
        };
    }

    async onAdd()
    {
        const {data} = await api.post("/routes", this.state);
        if (data.success)
        {
            this.props.routeAdded(this.state.source, this.state.target);
        }
        else
        {
            alert(data.error);
        }
    }

    render(props: AddRouteProps, state: AddRouteState) {
        return (
            <ul className="routes">
                <li className="route">
                    <div className="source">
                        <input type="text" placeholder="Source" onChange={(evt: any) => this.setState({source: evt.target.value})} />
                    </div>
                    <div className="target">
                        <input type="text" placeholder="Target" onChange={(evt: any) => this.setState({target: evt.target.value})} />
                    </div>
                    <button type="button" onClick={this.onAdd.bind(this)} className="btn">Add</button>
                </li>
            </ul>
        );
    }
}