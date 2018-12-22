
import { h, Component } from "preact";
import { api } from "../api";
import { Route } from "../../shared/admin-api";

export interface RoutesProps {
    routes: Route[];
}
interface RoutesState {
}
export class Routes extends Component<RoutesProps, RoutesState> {
    constructor(props: RoutesProps) {
        super(props);
        this.state = {};
    }

    render(props: RoutesProps, state: RoutesState) {
        return (
            <ul className="routes">
                {this.props.routes.map(({source, target}) => 
                    <li className="route">
                        <div className="source">{ source }</div>
                        <div className="target">{ target }</div>
                    </li>
                )}
            </ul>
        );
    }
}