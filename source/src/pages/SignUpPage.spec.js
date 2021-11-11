import SignUpPage from "./SignUpPage";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import {setupServer} from "msw/node"
import {rest} from "msw"

describe("Sign Up Page", () => {
    describe("Layout", () => {
        it("has header", () => {
            render(<SignUpPage/>);
            const header = screen.queryByRole("heading", {name: "Sign Up"});
            expect(header).toBeInTheDocument();
        });
        it("has username input", () => {
            const {container} = render(<SignUpPage/>);
            const input = screen.getByPlaceholderText("username");
            expect(input).toBeInTheDocument();
        });
        it("has email input", () => {
            const {container} = render(<SignUpPage/>);
            const input = screen.getByPlaceholderText("email");
            expect(input).toBeInTheDocument();
        });
        it("has password input", () => {
            const {container} = render(<SignUpPage/>);
            const input = screen.getByPlaceholderText("password");
            expect(input).toBeInTheDocument();
        });
        it("has password type", () => {
            const {container} = render(<SignUpPage/>);
            const input = screen.getByPlaceholderText("password");
            expect(input.type).toBe('password');
        });
        it("has password repeat input", () => {
            const {container} = render(<SignUpPage/>);
            const input = screen.getByPlaceholderText("repeat password");
            expect(input).toBeInTheDocument();
        });
        it("has password repeat type", () => {
            const {container} = render(<SignUpPage/>);
            const input = screen.getByPlaceholderText("repeat password");
            expect(input.type).toBe('password');
        });
        it("has Sign Up button", () => {
            render(<SignUpPage/>);
            const button = screen.queryByRole("button", {name: "Sign Up"});
            expect(button).toBeInTheDocument();
        });
        it("disables the burron initially", () => {
            render(<SignUpPage/>);
            const button = screen.queryByRole("button", {name: "Sign Up"});
            expect(button).toBeDisabled();
        });
    });
    describe('Interactions', () => {


        let requestBody;
        let counter = 0;
        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                requestBody = req.body
                counter += 1;
                return res(ctx.status(200));
            })
        );

        beforeAll(() => server.listen())
        afterAll(() => server.close())
        beforeEach(() => {
            counter = 0;
            server.restoreHandlers()
        })

        let button;

        const setup = () => {
            render(<SignUpPage/>);
            const userNameInput = screen.getByPlaceholderText("username");
            const emailInputRepeat = screen.getByPlaceholderText("email");
            const passwordInput = screen.getByPlaceholderText("password");
            const passwordInputRepeat = screen.getByPlaceholderText("repeat password");
            userEvent.type(userNameInput, "pepito1")
            userEvent.type(emailInputRepeat, "pepito1@mail.com")
            userEvent.type(passwordInput, "p4ssword")
            userEvent.type(passwordInputRepeat, "p4ssword")
            button = screen.queryByRole("button", {name: "Sign Up"});
        }

        it('enables the button when password and password repeat fields have same value', () => {
            setup()
            expect(button).toBeEnabled();
        });


        it('sends username , email and password to backend after clicking the button', async () => {

            setup()
            userEvent.click(button)
            await new Promise(resolve => setTimeout(resolve, 500))

            expect(requestBody).toEqual({
                username: 'pepito1',
                email: 'pepito1@mail.com',
                password: 'p4ssword'
            });
        });

        it('disables button when there is an ongoing api call', async () => {
            setup()
            userEvent.click(button);
            userEvent.click(button);
            await screen.findByText('Please check your e-mail to activate your account')

            expect(counter).toBe(1);
        });

        it('diplays spinner while the api request in progress', async () => {
            setup()
            userEvent.click(button);
            const spinner = screen.getByRole('status')
            expect(spinner).toBeInTheDocument();
        });
        it('diplays spinner after clicking the submit', async () => {
            setup()
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            userEvent.click(button);
            const spinner = screen.getByRole('status')
            expect(spinner).toBeInTheDocument();
            await screen.findByText('Please check your e-mail to activate your account')
        });
        it('does not display spinner when there is no api request', () => {
            setup();
            const spinner = screen.queryByRole('status')
            expect(spinner).not.toBeInTheDocument();
        })
        it('diplays account activation notification after successful sign up request', async () => {
            setup()
            const message = "Please check your e-mail to activate your account";
            expect(screen.queryByText(message)).not.toBeInTheDocument()
            userEvent.click(button);
            /**
             * await for the text appear
             */
            const text = await screen.findByText("Please check your e-mail to activate your account")
            expect(text).toBeInTheDocument();
        });
        it('hides sign up dorm after successful sign up request ', async () => {

            setup()
            const form = screen.getByTestId("form-sign-up");
            userEvent.click(button);
            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            })
            /**
             * Other way
             */
            // await waitForElementToBeRemoved(form);
        });
        it('displays validation message for username ', async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(400),
                        ctx.json({
                            validationErrors: {username: "Username cannot be null"}
                        }));
                })
            )

            setup()
            userEvent.click(button)
            const validationError = await screen.findByText("Username cannot be null")
            expect(validationError).toBeInTheDocument()
        });

        it('displays validation message for email ', async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res.once(ctx.status(400),
                        ctx.json({
                            validationErrors: {username: "E-mail cannot be null"}
                        }));
                })
            )

            setup()
            userEvent.click(button)
            const validationError = await screen.findByText("E-mail cannot be null")
            expect(validationError).toBeInTheDocument()
        });


        it('displays validation message for password ', async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res.once(ctx.status(400),
                        ctx.json({
                            validationErrors: {username: "Password must be at least 6 characters"}
                        }));
                })
            )

            setup()
            userEvent.click(button)
            const validationError = await screen.findByText("Password must be at least 6 characters")
            expect(validationError).toBeInTheDocument()
        });
        it('hides spinner and enables button after response recived', async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res.once(ctx.status(400),
                        ctx.json({
                            validationErrors: {username: "Password must be at least 6 characters"}
                        }));
                })
            )

            setup()
            userEvent.click(button)
            await screen.findByText("Password must be at least 6 characters")
            expect(screen.queryByRole("status")).not.toBeInTheDocument();
            expect(button).toBeEnabled();
        });

    })
});
