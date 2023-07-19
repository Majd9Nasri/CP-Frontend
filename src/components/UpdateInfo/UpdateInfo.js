import "./UpdateInfo.scss"
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store.ts";
import { useEffect , useRef, useState } from "react"
import Field from "../reusableComppnents/Field/Field.js"
import Area from "../reusableComppnents/Area/Area.js"
import Button from "../reusableComppnents/Button/Button.js"
import swal from 'sweetalert';

const UpdateInfo= ( {updateOpportunity, updateAddress, updateCustomer }) => {
 
const dispatch = useAppDispatch(); 
const selectedOpportunity  = useSelector((state) => state.opportunity?.selectedOpportunity || []);
const selectedPhases = useSelector((state) => state.opportunity.selectedOpportunity?.phases_json || []);
const selectedAddress  = useSelector((state) => state.address?.selectedAddress || [] );
const selectedCustomer = useSelector((state) => state.customer?.selectedCustomer || []);
const roles = useSelector((state) => state.role.roles);
const [phases, setPhases] = useState([{ name: "", start: "", end: "", roleAssignment:[{ Role: "", hours: "" }] }]);

//***************************** useEffect *****************************//
useEffect(() => {
  window.scrollTo(0, 0); 
}, []);

useEffect(() => {
 
   
  const currentPhases = selectedPhases.map(phase => {
    const currentRoleAssignment = phase.roleAssignment.map(roleAssignment => ({ ...roleAssignment }));
    
    return {
      ...phase,
      roleAssignment: currentRoleAssignment
    };});

  setPhases(currentPhases);

}, [selectedPhases]);



const opportunityId =  selectedOpportunity.id;
const customerId =  selectedCustomer.id;

  //***************************** Ref for Opportunity Infos *****************************//
  const name = useRef(null)
  const date = useRef(null)
  const link = useRef(null)
  const description= useRef(null)
  const salesfunnel = useRef("")
  const customerRepresentative = useRef("")

   //***************************** Ref for Customer and Address Infos *****************************//
  const customerName = useRef(null)
  const email = useRef(null)
  const customerContactPerson = useRef("")
  const number = useRef("")
  const country = useRef(null)
  const city = useRef(null)
  const street = useRef(null)
  const zipCode = useRef(null) 

 //************************** check form ********************************//
  const checkForm = () => {
    if (
      !name.current.value ||
      !date.current.value ||
      !link.current.value ||
      !description.current.value ||
      !salesfunnel.current.value ||
      !customerRepresentative.current.value ||
      !customerName.current.value ||
      !email.current.value ||
      !country.current.value ||
      !city.current.value ||
      !street.current.value ||
      !zipCode.current.value
    ) {
      return false;
    }

    for (const phase of phases) {
      if (!phase.name || !phase.start || !phase.end) {
        return false;
      }
      for (const assignment of phase.roleAssignment) {
        if (!assignment.Role ||assignment.Role ==="Rolle" || !assignment.hours || assignment.hours < 1  ) {
          return false;
        }
      }
    }
  
    
    return true;
  };
  


  /* ********************************** handle Phase  ************************************** */
 
  const handleAddPhases = () => {
    setPhases([...phases, { name: "", start: "", end: "", roleAssignment: [{ Role: "", hours: "" }] }]);
  };

  const handleNameChange = (event, index) => {
    const newPhase = [...phases];
    newPhase [index] = { ...newPhase[index], name: event.target.value };
    setPhases(newPhase );
  };

  const handleStartChange = (event, index) => {
    const newPhase  = [...phases];
    newPhase [index] = { ...newPhase[index], start: event.target.value };
    setPhases(newPhase );
  };

  const handleEndChange = (event, index) => {
      const newPhase  = [...phases];
      newPhase [index] = { ...newPhase [index], end: event.target.value };
      setPhases(newPhase );
    };
  
    const handleRemovePhase = (index) => {
      const newPhases = [...phases];
      newPhases.splice(index, 1);
      setPhases(newPhases);
    };

    const handleAddRoleAssignment = (index) => {
      const newPhases = [...phases];
      newPhases[index].roleAssignment = [...newPhases[index].roleAssignment, { Role: "", hours: "" }];
      setPhases(newPhases);
    };
    const handleRoleAssignmentChange = (event, phaseIndex, assignmentIndex) => {
      const newPhases = [...phases];
      newPhases[phaseIndex].roleAssignment[assignmentIndex].Role =
        event.target.value;
      setPhases(newPhases);
    };
    
    const handleRoleAssignmentHoursChange = (event, phaseIndex, assignmentIndex) => {
      const newPhases = [...phases];
      newPhases[phaseIndex].roleAssignment[assignmentIndex].hours =
        event.target.value;
      setPhases(newPhases);
    };

    const handleRemoveRoleAssignment = (phaseIndex, roleIndex) => {
      const newPhase = [...phases];
      newPhase[phaseIndex].roleAssignment.splice(roleIndex, 1);
      setPhases(newPhase);
    };

  //**********************************************************//  
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkForm()) {
      swal("Bitte tragen Sie alle Felder ein");
      return;
    }
    
     //*************************** data *******************************//
    const updatedOpportunity  =  {
      id: opportunityId ,
      name: name.current.value,
      date: date.current.value,
      customerRepresentative: customerRepresentative.current.value,
      link: link.current.value,
      salesfunnel: salesfunnel.current.value,
      phases_json: phases,
      description: description.current.value,
      Customer_id: customerId
    };

    const updatedAddress  =  {
      customer:  customerId,
      country: country.current.value,
      city: city.current.value,
      street: street.current.value,
      zipCode: zipCode.current.value, 
    };

    const updatedCustomer =  {
      id: customerId,
      name: customerName.current.value,
      customerContactPerson: customerContactPerson.current.value,
      email: email.current.value,
      number:   number.current.value,
    };
    
    
    
      dispatch(updateOpportunity(updatedOpportunity));
      dispatch(updateCustomer(updatedCustomer));
      dispatch(updateAddress(updatedAddress ));

     swal(`${name.current.value} erfolgreich aktualisiert`);  
  };
  //**********************************************************//  
  if (selectedOpportunity.length === 0) {
    return (
      <>
        <div className="create-container">
          <div className="title">Keine Chance ausgewäht</div>
        </div>
      </>
    );
  }
   else {
  return (
    <>
      <div className="create-container">
            <form   onSubmit={handleSubmit} >
            <div className="create-form">
            <div className="title">Chance Information</div>
          
            <Field text = "Name" type="text" defaultValue={selectedOpportunity.name} reference = {name}/>
            <Field text = "Datum" type="date" defaultValue={selectedOpportunity.date} reference = {date}/>
            <Field text = "Kundenbetreuer" type="text" defaultValue={selectedOpportunity.customerRepresentative} reference = {customerRepresentative}/>
            <Field text = "Salesfunnel" type="text" defaultValue={selectedOpportunity.salesfunnel} reference = {salesfunnel}/>
            <Field text = "Link" type="text" defaultValue={selectedOpportunity.link} reference = {link}/>
            <Area  text = "Beschreibung" defaultValue={selectedOpportunity.description}  reference={description}/>
            <div className="title">Kunde</div> 
            <Field text = "Kunde" type="text" defaultValue={ selectedCustomer.name} reference ={customerName}/>
            <Field text = "Ansprechpartner" type="text" defaultValue={ selectedCustomer.customerContactPerson} reference ={customerContactPerson}/>
            <Field text = "Email-Addresse" type="text" defaultValue={ selectedCustomer.email}  reference={email}/>
            <Field text = "Telefonnummer" type="text" defaultValue={ selectedCustomer.number}  reference={number}/>
            <Field text = "Land" type="text" defaultValue={ selectedAddress.country}  reference={country}/>
            <Field text = "Stadt" type="text" defaultValue={ selectedAddress.city}  reference={city}/>
            <Field text = "Straße" type="text" defaultValue={ selectedAddress.street}  reference={street}/>
            <Field text = "Postleitzahl" type="text" defaultValue={ selectedAddress.zipCode} reference={zipCode}/>
            <div className="title">Kapazität</div>

            </div>
            {phases.map((phase, phaseIndex) => (
      <div  key={phaseIndex}>
        <div className="phase-name">
          <Field  text = "Bezeichnung der Phase" type="text"  value={phase.name} onChange={(event) => handleNameChange(event, phaseIndex)}    />
        </div>
          <div className="create-form">
         <Field  text = "Start" type="date"  value={phase.start}  onChange={(event) => handleStartChange(event, phaseIndex)}  />
         <Field  text = "Ende" type="date"  value={phase.end}  onChange={(event) => handleEndChange(event, phaseIndex)} />
         </div>
     
       
          {phase.roleAssignment.map((assignment, assignmentIndex) => (
            <div  key={assignmentIndex}>
               <div className="create-form">
              
               <select className="select-role"  id="exampleFormControlSelect1" value={assignment.role} onChange={(event) => handleRoleAssignmentChange(event, phaseIndex, assignmentIndex)} >
               <option> {phases[phaseIndex].roleAssignment[assignmentIndex].Role ? phases[phaseIndex].roleAssignment[assignmentIndex].Role : "Rolle"}</option>
               {roles.map((role) => {

            if (phases[phaseIndex].roleAssignment.some((assignedRole) => assignedRole.Role === role.role_type)) {
              return null; 
            }
            return (
              <option key={role.id}>{role.role_type}</option>
            )
          })}
              </select>
             
               <Field  text = "Bedarf in Stunden pro Kalenderwoche" type="number"  value={assignment.hours} onChange={(event) => handleRoleAssignmentHoursChange(event, phaseIndex, assignmentIndex) }/>
               </div>

               <div className="phase-name">
               {assignmentIndex > 0 && (
                <button type="button" className="btn"  onClick={() => handleRemoveRoleAssignment(phaseIndex, assignmentIndex)}>
                Rolle löschen
                </button>
              )}
              </div>
           </div>
          ))}
          
              <div className="create-form2" >
                  <button type="button" className="btn" onClick={() => handleAddRoleAssignment(phaseIndex)}>Rolle hinzufügen</button>
                  <button type="button" className="btn" onClick={() => handleRemovePhase(phaseIndex)}>Phase löschen</button>
                
            </div>
          </div>
        ))}
      <div className="phase-name">
   <button type="button" className="btn"onClick={handleAddPhases}>Phase hinzufügen</button>
   </div>
           
            <Button  type="submit" text="aktualisieren"/>
            
        </form>
    </div>  
  </>
  ); }  
}

export default UpdateInfo