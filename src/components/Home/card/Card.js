import  "./Card.scss"
import {  Link } from "react-router-dom";



function Card(props) {
  
  return (
    <div className="card-container">
      {props.opportunities.map((opportunity) => (
        <div className="card" key={opportunity.id}>
          <div>
            <h2 className="title">{opportunity.name}</h2>
            <h6 className="title2">{opportunity.date}</h6>
            <h6 className="description">{opportunity.description}</h6>
           
            <div className="button-container">
              <button
                className="button"
                onClick={() => props.handleDelete(opportunity.id, opportunity.name)}
              >
                löschen
              </button>
              <Link
                className="button"
                to={"/getInfo"}
                type="button"
                onClick={() => props.handleGetInfo(opportunity.id, opportunity.Customer_id)}
              >
                Info
              </Link>
              <Link
                className="button"
                to={"/updateInfo"}
                type="button"
                onClick={() => props.handleGetInfo(opportunity.id, opportunity.Customer_id)}
              >
                bearbeiten
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;