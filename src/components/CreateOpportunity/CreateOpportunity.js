import "./CreateOpportunity.scss"
import { useEffect , useRef, useState } from "react"
import Field from "../reusableComppnents/Field/Field.js"
import Area from "../reusableComppnents/Area/Area.js"
import Button from "../reusableComppnents/Button/Button.js"
import { useAppDispatch } from "../../store/store.ts";
import { createOpportunity } from "../../store/features/opportunitySlice";
import { createCustomerDetails} from "../../store/features/customerDetailsSlice";
import { useSelector } from "react-redux";
import swal from 'sweetalert';

const CreateOpportunity = () => {
  const customers = useSelector((state) => state.customer.customers);
  const dispatch = useAppDispatch(); 
    //***************************** useState *****************************//
    const roles = useSelector((state) => state.role.roles);
    const [phases, setPhases] = useState([{ name: "", start: "", end: "", roleAssignment :[{ Role: "", hours: "" }] }]);
    const [SelectedCustomer, setSelectedCustomer] = useState("Neuer Kunde");
    const [hideCustomerFields, setHideCustomerFields] = useState(false);
    

//***************************** useEffect *****************************//

    useEffect(() => {
      window.scrollTo(0, 0); 
    }, []);
    
   //***************************** Ref for Opportunity Infos *****************************//
  const name = useRef("")
  const date = useRef("")
  const link = useRef("")
  const description= useRef("")
  const salesfunnel = useRef("")
  const customerRepresentative = useRef("")

   //***************************** Ref for Customer Infos *****************************//
  const customerName = useRef("")
  const customerContactPerson = useRef("")
  const number = useRef("")
  const email = useRef("")
     //***************************** Ref for Address Infos *****************************//
  const country = useRef("")
  const city = useRef("")
  const street = useRef("")
  const zipCode = useRef("") 

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
        newPhases[index].roleAssignment.push({ Role: "", hours: "" });
        setPhases(newPhases);
      };

      const handleRoleAssignmentChange = (event, phaseIndex, assignmentIndex) => {
        const newPhases = [...phases];
        newPhases[phaseIndex].roleAssignment[assignmentIndex].Role =
          event.target.value;
        setPhases(newPhases);
      };
      
      const handleRoleAssignmentHoursChange = (event,phaseIndex,assignmentIndex) => {
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

 //***************************** check if new customer *****************************//
 const handleSelectCustomer= (event) => {
  setSelectedCustomer(event.target.value);
  if (event.target.value === "Neuer Kunde") {
    setHideCustomerFields(false)
}
else {
  setHideCustomerFields(true)
}
};

 //************************** check form ********************************//
 const checkForm = () => {
  if (
    !name.current.value ||
    !date.current.value ||
    !link.current.value ||
    !description.current.value ||
    !salesfunnel.current.value ||
    !customerRepresentative.current.value
  ) {
    return false;
  }

  if (SelectedCustomer === "Neuer Kunde") {
    if (
      !customerName.current.value ||
      !customerContactPerson.current.value ||
      !number.current.value ||
      !email.current.value ||
      !country.current.value ||
      !city.current.value ||
      !street.current.value ||
      !zipCode.current.value
    ) {
      return false;
    }
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


 //****************************clear Fields after insert******************************//

const clearInputFields =() => {
  name.current.value = "";
  date.current.value = "";
  link.current.value = "";
  description.current.value = "";
  customerRepresentative.current.value = "";
  salesfunnel.current.value = "";
  setPhases([{ name: "", start: "", end: "", roleAssignment :[{ Role: "", hours: "" }] }])
  if (SelectedCustomer === "Neuer Kunde") {
      customerName.current.value = "";
      email.current.value = "";
      customerContactPerson.current.value = "";
      number.current.value = "";
      country.current.value = "";
      city.current.value = "";
      street.current.value = "";
      zipCode.current.value = "";
}
}
 //**************************** insert data function ******************************//
 const insertData= (e) => {
    e.preventDefault();
    if (!checkForm()) {
      swal("Bitte tragen Sie alle Felder ein");
      return;
    }

 //**********************************************************//
    const selectedCustomerName = SelectedCustomer;
    const customer = customers.find((el) => el.name === selectedCustomerName);
   

 //*************************** data *******************************//
 if (SelectedCustomer === "Neuer Kunde") {
 
      const customerData = {
        name: customerName.current.value,
        number: number.current.value,
        customerContactPerson: customerContactPerson.current.value,
        email: email.current.value,
        address: {
            country: country.current.value,
            city: city.current.value,
            street: street.current.value,
            zipCode: zipCode.current.value,
        },
        opportunities: [
            {
                name: name.current.value,
                date: date.current.value,
                link: link.current.value,
                customerRepresentative: customerRepresentative.current.value,
                salesfunnel: salesfunnel.current.value,
                description: description.current.value,
                phases_json: phases,
            }
        ]
      };
      dispatch(createCustomerDetails(customerData))
    }

    else {
    const opportunityData =  {
      name: name.current.value,
      date: date.current.value,
      link: link.current.value,
      customerRepresentative: customerRepresentative.current.value,
      salesfunnel:  salesfunnel.current.value,
      description: description.current.value,
      phases_json: phases,
      Customer_id: customer.id,
    };
    dispatch(createOpportunity(opportunityData))
  }
  
  //**********************************************************//   
    
swal(`${name.current.value} erfolgreich angelegt`);
  clearInputFields();
  };

//************************** return ********************************//   
  return (
    <>
    <div className="create-container">

    
       
        <form  onSubmit={insertData}>
          <div className="create-form">
            <div className="title">Chance Information</div>
            <Field  text = "Name" type="text" reference = {name} />
            <Field text = "Datum" type="date" reference = {date} />
            <Field text = "Link" type="text" reference = {link} />
            <Field text = "Kundenbetreuer" type="text" reference = {customerRepresentative} />
            <Field text = "Salesfunnel" type="text" reference = {salesfunnel} />
            <Area text = "Beschreibung" reference = {description} />
          
          
            <div className="title">Kunde</div>      
           
              <select className="select" id="exampleFormControlSelect1" value={SelectedCustomer} onChange={handleSelectCustomer}>
                  <option> Neuer Kunde</option>
                  {customers.map((selectCustomer) => (
                <option key={selectCustomer.id}>{selectCustomer.name}</option>
              ))}
              </select>



              {!hideCustomerFields ? (
        <>
          <Field text="Kunde" type="text" reference={customerName} />
          <Field text="Ansprechpartner" type="text" reference={customerContactPerson} />
          <Field text="Telefonnummer" type="text" reference={number} />
          <Field text="Email-Addresse" type="text" reference={email} />
          <Field text="Land" type="text" reference={country} />
          <Field text="Stadt" type="text" reference={city} />
          <Field text="Straße" type="text" reference={street} />
          <Field text="Postleitzahl" type="text" reference={zipCode} />
        </>
        
      ) : (
        <></>
      )}


{/* ********************************** phases ************************************** */}
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
            )})}
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
       <Button  type="submit" text="anlegen"/>
        
    </form>
    </div>
   
    </>
  )
}
export default CreateOpportunity