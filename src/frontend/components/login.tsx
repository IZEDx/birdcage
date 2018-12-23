
import { h, Component } from "preact";
import { api } from "../api";

export interface LoginProps {
    onAuth(): void;
}
interface LoginState {
    password: string;
}
export class Login extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            password: ""
        };
    }

    async componentDidMount() {
        const {data} = await api.get("/auth");
        if (data.authed) this.props.onAuth();
    }

    async onLogin()
    {
        const {data} = await api.post("/auth", {password: this.state.password});
        if (data.success)
        {
            this.props.onAuth();
        }
        else
        {
            alert(data.error);
        }
    }

    render(props: LoginProps, state: LoginState) {
        return (
            <div className="login">
                <div className="password">
                    <input type="password" placeholder="Password" onChange={(evt: any) => this.setState({password: evt.target.value})} />
                </div>
                <button type="button" onClick={this.onLogin.bind(this)} className="btn">
                    Login
                </button>
            </div>
        );
    }
}