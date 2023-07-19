import "./Area.scss"


const Area = (props) => {
  
  return (
    <div className="Area-form">
          
            <textarea className="Area-input" autoComplete="off" placeholder=" "  rows="3" ref={props.reference} defaultValue={ props.defaultValue}></textarea> 
            <label className="Area-label" htmlFor="textAreaExample4">{props.text}</label>
   </div>

  )
}
export default Area 