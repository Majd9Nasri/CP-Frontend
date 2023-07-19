import "./Navbar.scss"
import {  Link } from "react-router-dom";
import { useSelector } from "react-redux";



const Navbar = () => {
  const {error} = useSelector((state) => state.opportunity);


  return (
    <>
      
      
        <div className="navbar"> 
            <div className="nav">
                  <ul className="links">
                    <li> <Link className="link" to="/">Chancen</Link></li>
                    <li> <Link className="link"  to="/createOpportunity">Chance anlegen</Link></li>
                    <li>  <Link className="link"  to="/analysis">Auswertung</Link></li>
                    
                  </ul>
                  <div className="toggle_btn">
                    <i className="fa-solid fa-bars" ></i>
                  </div>
            </div>
        </div>  
        {error? (
        <div className="alert" >
                            Der Server Läuft nicht
        </div>):  null}
           
      
  </>
  )
}

export default Navbar