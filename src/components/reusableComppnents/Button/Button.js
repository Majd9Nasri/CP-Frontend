import "./Button.scss"


const Button = (props) => {
  
  return (
    <div className="Button-form">      
        <button type={props.type} className="bn5">
            {props.text}
        </button>
   </div>

  )
}
export default Button