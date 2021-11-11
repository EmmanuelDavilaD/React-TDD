const Input = (props) =>{
    const {id,placeholder,onChange,error, type} = props
    return (
        <div className="mb-3">
            <input className="form-control" id={id} type={type} placeholder={placeholder}
                   onChange={onChange}/>
            <span>{error}</span>
        </div>
    )
}

export default Input;