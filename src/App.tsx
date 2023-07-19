import "./App.scss"
import  {Navbar,Home,CreateOpportunity,Analysis,GetInfo,UpdateInfo} from "./components/index"
import { BrowserRouter as Router,  Routes, Route } from "react-router-dom";


import { useEffect } from "react";
import { useAppDispatch } from "./store/store";
import React from "react";
import { fetchOpportunity , deleteOpportunity,  updateOpportunity ,  selectOpportunity  } from "./store/features/opportunitySlice";
import { fetchCustomer  , deleteCustomer ,  updateCustomer ,  selectCustomer  } from "./store/features/customerSlice";
import { fetchAddress  , deleteAddress ,  updateAddress ,  selectAddress } from "./store/features/addressSlice";
import { createCustomerDetails } from "./store/features/customerDetailsSlice";

import { fetchRoles} from "./store/features/roleSlice";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchOpportunity());
    dispatch(fetchCustomer());
    dispatch(fetchAddress());
    dispatch(fetchRoles());
    
  });
  return (
    <>
            
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home selectCustomer={selectCustomer} selectAddress={selectAddress} deleteOpportunity={deleteOpportunity}  selectOpportunity={selectOpportunity}  dispatch={dispatch}  />} />
        <Route path='/createOpportunity' element={<CreateOpportunity/>} />
        <Route path='/analysis' element={<Analysis  />} /> 
        <Route path='/getInfo' element={<GetInfo selectCustomer={selectCustomer} selectAddress={selectAddress} deleteOpportunity={deleteOpportunity} selectOpportunity={selectOpportunity}  dispatch={dispatch}/>} />  
        <Route path='/updateInfo' element={<UpdateInfo updateOpportunity={updateOpportunity}  updateCustomer={updateCustomer}  updateAddress={updateAddress}     />} />  
      </Routes>
    </Router>
        </>
  );
}

export default App;
