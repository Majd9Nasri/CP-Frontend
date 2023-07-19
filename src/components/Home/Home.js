/* eslint-disable no-unused-expressions */
import { Button } from "bootstrap"
import "./Home.scss"
import { useEffect , useState, Fragment,  useRef } from "react"
import Swal from "sweetalert2";
import {  Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "./card/Card.js";



function Home ({ dispatch , deleteOpportunity  , selectOpportunity , selectCustomer , selectAddress }){


  const [searchValue , setSearchValue ] = useState(''); 
  const opportunities = useSelector((state) => state.opportunity.opportunities);
  const roles = useSelector((state) => state.role.roles);
  const {isLoading} = useSelector((state) => state.opportunity);
 
  
  //***************************** useEffect *****************************//

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);
  
 //**********************************************************//  
  const filteredOpportunities = opportunities.filter((opportunity) =>
  opportunity.name.toLowerCase().includes(searchValue.toLowerCase()) 
);
  //**********************************************************//  

const handleSearchValue= (e) => {
    setSearchValue(e.target.value); 
  };


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
  //**********************************************************//  

   
  return (

    <>
    <div className="home-container">
        <div className="form__group field">
          <input className="form__field"  type="search"  onChange={handleSearchValue} 
          placeholder="Name" name="name" id='name' required />
          <label className="form__label" htmlFor="form1">Suchen</label>
        </div> 
        <div className="isLoading">
        {isLoading ?('Die Daten werden geladen...') : null }
        </div>
        <Card opportunities={filteredOpportunities} handleGetInfo = {handleGetInfo} handleDelete={handleDelete}/> 
       
    </div>
   </>   
  ); 
}
export default Home







