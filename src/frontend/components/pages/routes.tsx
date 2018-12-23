
import { h, Component } from "preact";
import { api } from "../../api";
import { Route } from "../../../shared/admin-api";

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

    async onAdd()
    {
        const route = {
            source: this.state.input_source, 
            target: this.state.input_target, 
        };
        const {data} = await api.post("/routes", route);
        if (data.success)
        {
            this.setState({
                routes: [route, ...this.state.routes]
            });
        }
        else
        {
            alert(data.error);
        }
    }

    async onDelete(source: string, target: string)
    {
        const idx = this.state.routes.findIndex(r => r.source === source && r.target === target);
        if (idx >= 0)
        {
            const {source, target} = this.state.routes[idx];
            const {data} = await api.delete<"/routes/:source/:target">(`/routes/${encodeURIComponent(source)}/${encodeURIComponent(target)}`);
            if (data.success)
            {
                this.state.routes.splice(idx, 1);
                this.setState({routes: this.state.routes});
            }
            else
            {
                alert(data.error);
            }
        }
    }

    render(props: RoutesProps, state: RoutesState) {
        return (
            <div className="routes">
                <div className="routelist">
                    <div className="route">
                        <div className="source">
                            <input type="text" placeholder="Source" onChange={(evt: any) => this.setState({input_source: evt.target.value})} />
                        </div>
                        <div className="target">
                            <input type="text" placeholder="Target" onChange={(evt: any) => this.setState({input_target: evt.target.value})} />
                        </div>
                        <button type="button" onClick={this.onAdd.bind(this)} className="btn">
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                    {this.state.routes.map(({source, target}) => 
                        <div className="route">
                            <div className="source">{ source }</div>
                            <div className="target">{ target }</div>
                            <button type="button" onClick={() => this.onDelete(source, target)} className="btn">
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}