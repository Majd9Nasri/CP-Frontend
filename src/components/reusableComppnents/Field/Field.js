import "./Field.scss"


const Field = (props) => {
  
  return (
    <>
    {/* <div className="col-md-6">
        <label htmlFor="input" className="form-label">{props.text} </label>
        <input type={props.type} className="form-control" id="inputEmail4" ref={props.reference} defaultValue={ props.defaultValue}/>
    </div>  */}
     <div className="form">
     <input type={props.type} onChange={props.onChange}   className="form__input" autoComplete="off" placeholder=" " ref={props.reference} defaultValue={ props.defaultValue} value={props.value}  />
     
     <label htmlFor="input" className="form__label">{props.text}</label>
   </div>
   </>
  )
}
export default Field