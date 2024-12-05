const CheckBox = (props) => {
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                id={props.name}
                type="checkbox"
                value={props.value}
                name={props.name}
                onChange={props.onChange}
                checked={props.checked}
            />
            <label htmlFor={props.name} className="form-check-label">
                {props.title}
            </label>
        </div>
    )
}
export default CheckBox;