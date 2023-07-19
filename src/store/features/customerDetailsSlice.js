import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

//******** interface for customerDetailsState ********//

interface Address {
    country: string;
    city: string;
    street: string;
    zipCode: string;
  }
  
  interface Opportunity {
    name: string;
    date: string;
    link: string;
    description: string;
    salesfunnel: string;
    customerRepresentative: string;
  }
  
  interface CustomerDetails {
    id: string;
    name: string;
    customerContactPerson: string;
    number: string;
    email: string;
    address: Address;
    opportunities: Opportunity[];
  }
  
  interface CustomerDetailsState {
    customerDetails: CustomerDetails[];
    isLoading: boolean;
    error: boolean;
  }
  
  const initialState: CustomerDetailsState = {
    customerDetails: [],
    isLoading: false,
    error: false,
  };


  //******** create customerDetails AsyncThunk ********//

  export const createCustomerDetails = createAsyncThunk(
    "customerDetails/create",
    async (customerDetails,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try {
      const response = await fetch(`http://127.0.0.1:8000/customersDetails/`, {
        method: "POST",
        body: JSON.stringify(customerDetails),
        headers: {
          "Content-Type": "application/json",
      }} ) 
      const data = await response.json();
      return data;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

 

  //******** create customerDetailsSlice ********//

export const CustomerDetailsSlice = createSlice({
  name: "customerDetails",
  initialState: initialState,
  reducers: {
   
  },
    
  extraReducers: (builder) => {
    builder


   //******** create customerDetails reducer ********//

    .addCase(createCustomerDetails.fulfilled, (state, action) => {
      state.customerDetails.push(action.payload);
      state.isLoading = false;
    })
     .addCase(createCustomerDetails.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
     .addCase(createCustomerDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      }) 

 
      ;
      },  
  },
);


export default CustomerDetailsSlice.reducer;
