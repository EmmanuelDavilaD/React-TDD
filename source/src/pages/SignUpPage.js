import {Component} from "react";
import axios from "axios";
import Input from "../components/input";

class SignUpPage extends Component {
    state = {
        username: '',
        email: '',
        password: "",
        passwordRepeat: "",
        apiProgress: false,
        errors: {}
    };

    onChange = (event) => {
        const {id, value} = event.target;
        this.setState({
            [id]: value
        })
    }


    submit = async (event) => {
        event.preventDefault();
        const {username, email, password} = this.state;
        const body = {
            username, email, password
        }
        this.setState({apiProgress: true})
        try {
            await axios.post("/api/1.0/users", body);
            this.setState({signUpSuccess: true})
            this.setState({apiProgress: true})
        } catch (error) {
            if (error.response.status === 400) {
                this.setState(({errors: error.response.data.validationErrors}))
            }
            this.setState({apiProgress: false})
        }
        //  fetch("/api/1.0/users", {
        //      method: 'POST',
        //     headers:{
        //       "Content-Type": "application/json"
        //       },
        //       body: JSON.stringify(body)
        //   })
    }

    render() {
        let disabled = true;
        const {password, passwordRepeat, apiProgress, signUpSuccess, errors} = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat;
        }
        return (
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-12">
                {!signUpSuccess && <form className="card mt-5" data-testid="form-sign-up">
                    <div className="card-header">
                        <h1 className="text-center mb-3 mt-3"> Sign Up </h1>
                    </div>

                    <div className="card-body">
                        {/*<div className="mb-3">*/}
                        {/*    <input className="form-control" id="username" placeholder="username"*/}
                        {/*           onChange={this.onChange}/>*/}
                        {/*    <span>{errors.username}</span>*/}
                        {/*</div>*/}
                        <Input id='username' type='text' placeholder='username' onChange={this.onChange}
                               error={errors.username}/>
                        <Input id='email' placeholder='email' type='email' onChange={this.onChange}
                               error={errors.email}/>
                        <div className="mb-3">
                            <Input id='password' type='password' placeholder='password' onChange={this.onChange}
                                   error={errors.password}/>
                        </div>
                        <div className="mb-3">
                            <Input id='passwordRepeat' type='password' placeholder='repeat password'
                                   onChange={this.onChange} error={" "}/>

                        </div>
                        <div className="mb-3 text-center">
                            <button className="btn btn-primary" disabled={disabled || apiProgress} type="submit"
                                    onClick={this.submit}>
                                {apiProgress && (<span role="status" className="visually-hidden">Loading...</span>)}
                                Sign Up{" "}
                            </button>
                            {" "}
                        </div>
                    </div>
                </form>}
                {signUpSuccess &&
                <div className="alert alert-primary mt-3">Please check your e-mail to activate your account</div>}
            </div>
        );
    }
}

export default SignUpPage;
