
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";
import { Checkbox } from "./checkbox";
import { Input } from "./input";

export interface RouteProps {
    route: Route;
    onDeleted(route: Route): void;
}
interface RouteState {
    expanded: boolean;
    route: Route;
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
        const {source, target} = this.props.route;
        const {data} = await api.delete<"/routes/:source/:target">(`/routes/${encodeURIComponent(source)}/${encodeURIComponent(target)}`);
        if (data.success)
        {
            this.props.onDeleted(this.props.route);
        }
        else
        {
            alert(data.error);
        }
    }

    onUpdate()
    {
        console.log("Update", this.props.route);
    }

    setRoute<K extends keyof Route>(key: K, value: Route[K])
    {
        this.setState({route: {...this.props.route, [key]: value}})
    }

    toggleExpansion()
    {
        this.setState({expanded: !this.state.expanded});
    }

    render(props: RouteProps, state: RouteState) {
        return (
            <div className={`route ${state.expanded ? "expanded" : ""}`}>
                <div className="source">{ this.props.route.source }</div>
                <div className="target">{ this.props.route.target }</div>
                <button type="button" onClick={this.toggleExpansion.bind(this)} className="btn expand">
                    {this.state.expanded
                        ? <i className="fa fa-caret-up"></i>
                        : <i className="fa fa-caret-down"></i>
                    }
                </button>
                <div className="ssl">
                    <Checkbox label="HTTPS" checked={this.props.route.ssl} onChanged={checked => this.setRoute("ssl", checked)} />
                </div>
                <div className="email">
                    <Input placeholder="Owner email" value={this.state.route.email} onChanged={val => this.setRoute("email", val)} onSubmit={this.onUpdate.bind(this)} />
                </div>
                <button type="button" onClick={this.onUpdate.bind(this)} className="btn save">
                    <i className="fa fa-save"></i>
                </button>
                <button type="button" onClick={this.onDelete.bind(this)} className="btn delete">
                    <i className="fa fa-trash"></i>
                </button>
            </div>
        );
    }
}