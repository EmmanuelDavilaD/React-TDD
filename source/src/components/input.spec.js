import {render, screen, waitFor} from "@testing-library/react";
import Input from "./input";

it('has is-invalid class for input when help is set', function () {
  const {container} = render(<Input error='Error message'/>)
    const input = container.querySelector("input");
expect(input.classList).toContain('is-invalid')
})

it('has is-invalid class for span', function () {
    const {container} = render(<Input error='Error message'/>)
    const span = container.querySelector("span");
    expect(span.classList).toContain('invalid-feedback')
})

it('does not have is-invalid class for input when help is not set', function () {
    const {container} = render(<Input/>)
    const input = container.querySelector("input");
    expect(input.classList).not.toContain('is-invalid')
})