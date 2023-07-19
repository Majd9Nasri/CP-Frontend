import "./GetInfo.scss"
import { useSelector } from "react-redux";
import { useState , useEffect  } from "react";
import {  Link } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "../reusableComppnents/Button/Button.js"
import { useNavigate } from 'react-router-dom';

const GetInfo= ({dispatch , deleteOpportunity , selectOpportunity , selectCustomer , selectAddress}) => {

  const [showFullDescription, setShowFullDescription] = useState(false);
  const opportunity= useSelector((state) => state.opportunity.selectedOpportunity);
  const customer = useSelector((state) => state.customer.selectedCustomer);
  const address = useSelector((state) => state.address.selectedAddress);
 



 useEffect(() => {
  window.scrollTo(0, 0); 
}, []);

  //********************* handleDelete *************************************//  
  const handleDelete = (id , name) => {
    Swal.fire({
      title: 'Bist du sicher?',
      text: `Möchtest du '${name}' wirklich löschen?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ja, löschen',
      cancelButtonText: 'Nein, abbrechen',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOpportunity(id))
        Swal.fire('Gelöscht!', ` '${name}' wurde gelöscht.`, 'success');
      }
    });
  };

  //*********************** handleGetInfo ***********************************//  

  const handleGetInfo = (opportunityId, customerId) => {
    dispatch(selectCustomer(customerId));
    dispatch(selectAddress(customerId));
    dispatch(selectOpportunity(opportunityId));

  };

   //********* show Full Description ***********//  
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  //********* period of opportunity ***********//  
  let opportunityStart = null;
  let opportunityEnd = null;
  
  if (opportunity) {
    for (let i = 0; i < opportunity.phases_json.length; i++) {
      const currentPhase = opportunity.phases_json[i];
      if (i === 0) {
        opportunityStart = currentPhase.start;
      }  
      if (i === opportunity.phases_json.length - 1) {
        opportunityEnd = currentPhase.end;
      }
    }
  }
  
  //********* return ***********//   
  if (!opportunity) {
    return (
      <>
        <div className="card-container2">
          <div className="card-title"> Keine Chance ausgewählt... </div> 
        </div>
      </>
    );
  }
  
  else {
  return (
    <>
    <div className="card-container2">
      <div className="card-title"> Chance Information </div> 
   
  
      <div className="card-body">
                <h5 className="card-text"  ><span className="text-label">Name <br></br></span> {opportunity.name}</h5>
                <h5 className="card-text"  ><span className="text-label">Datum<br></br></span> {opportunity.date}</h5>
                <h5 className="card-text"  ><span className="text-label">Kundenbetreuer<br></br> </span> {opportunity.customerRepresentative}</h5>
                <h5 className="card-text"  ><span className="text-label">Salesfunnel<br></br></span> {opportunity.salesfunnel}</h5>
                <h5 className="card-text"  ><span className="text-label">Link<br></br> </span> {opportunity.link}</h5>
            </div> 
          
            <div className="timeline">
            <div className="wrapper option-1 option-1-1">
                <ol className="c-stepper"> 
                  <li className="c-stepper__item">
                    <h3 className="c-stepper__title">{opportunityStart}</h3>
                  </li>
                  <li className="c-stepper__item">
                    <h3 className="c-stepper__title">{opportunityEnd}</h3>
                  </li>
                </ol>
            </div>   
            </div>   
      
    

      <div className="card-center"><span className="text-label">Beschreibung</span> </div> 
      <div className="card-text-large">
          {showFullDescription 
            ? opportunity.description
            : opportunity.description.substring(0, 200) + "..."}
            
        </div>
        <div className="card-center"> 
        <button className ="btn" onClick={toggleDescription}>
          {showFullDescription ? "-" : "+"}
        </button>
        </div> 
        <span className="linie"></span>
        <div className="card-title">Kunde</div> 
        <div className="card-body">
                <h5 className="card-text"  ><span className="text-label">Name <br></br></span> {customer.name}</h5>
                <h5 className="card-text"  ><span className="text-label">Ansprechpartner<br></br> </span> {customer.customerContactPerson}</h5>
                <h5 className="card-text"  ><span className="text-label">Nummer: <br></br></span> {customer.number}</h5>
                <h5 className="card-text"  ><span className="text-label">Email <br></br></span>{customer.email}</h5>
                {address && (
                <>
                <h5 className="card-text"  ><span className="text-label">Land <br></br></span>{address.country}</h5>
                <h5 className="card-text"  ><span className="text-label">Stadt<br></br> </span>{address.city}</h5>
                <h5 className="card-text"  ><span className="text-label">Straße <br></br></span>{address.street}</h5>
                <h5 className="card-text"  ><span className="text-label">PLZ <br></br></span>{address.zipCode}</h5>  
                </>
                  )}
            </div> 
          
            <div className="card-title">Kapazität</div> 
           
              {opportunity.phases_json.map((phase, index) => (
              <div key={index}>
                 <div className="card-center"><span className="text-label">{phase.name}</span> </div> 
                 
                 <div className="timeline">
                    <div className="wrapper option-1 option-1-1">
                        <ol className="c-stepper"> 
                          <li className="c-stepper__item">
                            <h3 className="c-stepper__title">{phase.start}</h3>
                          </li>
                          <li className="c-stepper__item">
                            <h3 className="c-stepper__title">{phase.end}</h3>
                          </li>
                        </ol>
                    </div>   
                 </div>
                
              <div className="card-body">
                
                    {phase.roleAssignment.map((assignment, index) => (
                      <h5 key={index}  className="card-text">
                         <span className="text-label">{assignment.Role}</span> <br></br> {assignment.hours} Stunden
                       </h5>
                    ))}
                
            </div> 
            
      </div>
      ))}
          
   
          <div className="card-body2">
            <button className ="btn"  onClick={() => handleDelete(opportunity.id, opportunity.name)}>
                Löschen
            </button>
            <Link
                className="btn"
                to={"/updateInfo"}
                type="button"
                onClick={() => handleGetInfo(opportunity.id, opportunity.Customer_id)}
              >
              Bearbeiten
              </Link>
            </div> 
            

                
     
    </div>
    </>
  )
}
  
}

export default GetInfo