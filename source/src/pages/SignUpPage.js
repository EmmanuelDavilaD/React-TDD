import {Component} from "react";
import axios from "axios";
import Input from "../components/input";
import {withTranslation} from "react-i18next"

class SignUpPage extends Component {
    state = {
        username: '',
        email: '',
        password: "",
        passwordRepeat: "",
        apiProgress: false,
        // errors: {
        //     username:"",
        //     email: "",
        //     password: "",
        //     anotherObject:{
        //         anotherField: ""
        //     }
        // }
        errors: {}
    };

    onChange = (event) => {
        const {id, value} = event.target;
        // const errorsCopy = JSON.parse(JSON.stringify(...this.state.errors))
        const errorsCopy = {...this.state.errors}
        delete errorsCopy[id];
        this.setState({
            [id]: value,
            errors: errorsCopy
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
        let {t, i18n} = this.props;
        let disabled = true;
        const {password, passwordRepeat, apiProgress, signUpSuccess, errors} = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat;
        }
        let passwordMismatch = password !== passwordRepeat ? t('passwordMismatchValidation') : "";
        return (
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-12">
                {!signUpSuccess && <form className="card mt-5" data-testid="form-sign-up">
                    <div className="card-header">
                        <h1 className="text-center mb-3 mt-3"> {t('signUp')} </h1>
                    </div>

                    <div className="card-body">
                        {/*<div className="mb-3">*/}
                        {/*    <input className="form-control" id="username" placeholder="username"*/}
                        {/*           onChange={this.onChange}/>*/}
                        {/*    <span>{errors.username}</span>*/}
                        {/*</div>*/}
                        <Input id='username' type='text' placeholder={t('username')} onChange={this.onChange}
                               error={errors.username}/>
                        <Input id='email' placeholder={t('email')} type='email' onChange={this.onChange}
                               error={errors.email}/>
                        <div className="mb-3">
                            <Input id='password' type='password' placeholder={t('password')} onChange={this.onChange}
                                   error={errors.password}/>
                        </div>
                        <div className="mb-3">
                            <Input id='passwordRepeat' type='password' placeholder={t('passwordRepeat')}
                                   onChange={this.onChange} error={passwordMismatch}/>
                        </div>

                        <div className="mb-3 text-center">
                            <button className="btn btn-primary" disabled={disabled || apiProgress} type="submit"
                                    onClick={this.submit}>
                                {apiProgress && (<span role="status" className="visually-hidden">Loading...</span>)}
                                {t('signUp')}{" "}
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

const SignUpPageWithTranslation = withTranslation()(SignUpPage);
export default SignUpPageWithTranslation;
