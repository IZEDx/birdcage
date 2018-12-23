
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";
import { Checkbox } from "./checkbox";

export interface RouteProps {
    route: Route;
    onDeleted(route: Route): void;
}
interface RouteState {
    route: Route;
    expanded: boolean;
}
export class RouteEntry extends Component<RouteProps, RouteState> {
    constructor(props: RouteProps) {
        super(props);
        this.state = {
            route: props.route,
            expanded: false
        };
    }

    async onDelete()
    {
        const {source, target} = this.state.route;
        const {data} = await api.delete<"/routes/:source/:target">(`/routes/${encodeURIComponent(source)}/${encodeURIComponent(target)}`);
        if (data.success)
        {
            this.props.onDeleted(this.state.route);
        }
        else
        {
            alert(data.error);
        }
    }

    onUpdate()
    {
        console.log("Update", this.state.route);
    }

    setRoute<K extends keyof Route>(key: K, value: Route[K])
    {
        this.setState({route: {...this.state.route, [key]: value}})
    }

    toggleExpansion()
    {
        this.setState({expanded: !this.state.expanded});
    }

    render(props: RouteProps, state: RouteState) {
        return (
            <div className={`route ${state.expanded ? "expanded" : ""}`}>
                <div className="source">{ this.state.route.source }</div>
                <div className="target">{ this.state.route.target }</div>
                <button type="button" onClick={this.toggleExpansion.bind(this)} className="btn expand">
                    {this.state.expanded
                        ? <i className="fa fa-caret-up"></i>
                        : <i className="fa fa-caret-down"></i>
                    }
                </button>
                <div className="ssl only-expanded">
                    <Checkbox label="HTTPS" checked={this.props.route.ssl} onChanged={checked => this.setRoute("ssl", checked)} />
                </div>
                <div className="email only-expanded">
                    <input type="text" placeholder="Owner email" value={this.props.route.email} onChange={(evt: any) => this.setRoute("email", evt.target.value)} />
                </div>
                <button type="button" onClick={this.onUpdate.bind(this)} className="btn save only-expanded">
                    <i className="fa fa-save"></i>
                </button>
                <button type="button" onClick={this.onDelete.bind(this)} className="btn delete only-expanded">
                    <i className="fa fa-trash"></i>
                </button>
            </div>
        );
    }
}