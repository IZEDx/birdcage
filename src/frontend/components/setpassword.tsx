
import { h, Component } from "preact";
import { api } from "../api";

interface SetPasswordState
{
    password: string;
}

export class SetPassword extends Component<{}, SetPasswordState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            password: ""
        };
    }

    async onSetPassword()
    {
        const {data} = await api.put("/auth", {password: this.state.password});
        if (data.success)
        {
            console.log("Success");
        }
        else
        {
            alert(data.error);
        }
    }

    render() {
        return (
            <div className="setpassword">
                <div className="password">
                    <input type="password" placeholder="Password" onChange={(evt: any) => this.setState({password: evt.target.value})} />
                </div>
                <button type="button" onClick={this.onSetPassword.bind(this)} className="btn">
                    Set Password
                </button>
            </div>
        );
    }
}