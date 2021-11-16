const Input = (props) =>{

    const {id,placeholder,onChange,error, type} = props;
    let inputClass = "form-control";
    if(error){
        inputClass += " is-invalid"
    }
    return (
        <div className="mb-3">
            <input className={inputClass} id={id} type={type} placeholder={placeholder}
                   onChange={onChange}/>
            {error && <span className="invalid-feedback">{error}</span>}
        </div>
    )
}

export default Input;