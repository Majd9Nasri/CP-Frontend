import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

//************************ interface for CustomerState ************************//

interface Customer{
  id: number;
  name: string;
  customerContactPerson: string;
  number: string; 
  email: string;
}

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: boolean;
  selectedCustomer?: Customer;
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  error: false,
  selectedCustomer: undefined,
};

//************************ get customers AsyncThunk ************************//

export const fetchCustomer = createAsyncThunk(
  "customer/fetch",
  async (_,thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
    const response = await fetch(`http://127.0.0.1:8000/customers/`, {
      method: "GET"
    } ) 
    const data = await response.json();
    return data;
  } catch (error){

    return rejectWithValue(error.message);
  }
  });

  //************************ create customer AsyncThunk ************************//

  export const createCustomer = createAsyncThunk(
    "customer/create",
    async (customerData,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try {
      const response = await fetch(`http://127.0.0.1:8000/customers/`, {
        method: "POST",
        body: JSON.stringify(customerData),
        headers: {
          "Content-Type": "application/json",
      }} ) 
      const data = await response.json();
      return data;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ delete customer AsyncThunk ************************//

  export const deleteCustomer = createAsyncThunk(
    "customer/delete",
    async (id,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try { 
      await fetch(` http://127.0.0.1:8000/customers/${id}/` , {
        method: 'DELETE',
      }) ;
      return id;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ update customer AsyncThunk ************************//

  export const updateCustomer = createAsyncThunk(
        'customer/update',
        async (data , thunkAPI) => {
          const {rejectWithValue} = thunkAPI;
          try {
            const response = await fetch(`http://127.0.0.1:8000/customers/${data.id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            } ) 
            const daten = await response.json();
            return daten;
          } catch (error) {
            return rejectWithValue(error.message);
          }
        }
      );


  //************************ create CustomerSlice ************************//

export const CustomerSlice = createSlice({
  name: "Customer",
  initialState: initialState,
  reducers: {
    selectCustomer: (state, action ) => {
      state.selectedCustomer = state.customers.find ((el) => el.id === action.payload);  
    }
  },
    
  extraReducers: (builder) => {
    builder

     //************************ fetchCustomer reducer ************************//

    .addCase(fetchCustomer.fulfilled, (state, action) => {
      state.isLoading = false;
      state.customers = action.payload;
    })
    .addCase(fetchCustomer.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchCustomer.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
  //************************ deleteCustomer reducer ************************//

    .addCase(deleteCustomer.fulfilled, (state, action) => {
      state.isLoading = false;
     state.customers = state.customers.filter ((el) => el.id !== action.payload);
    })
    .addCase(deleteCustomer.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteCustomer.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

   //************************ createCustomer reducer ************************//

    .addCase(createCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload);
      state.isLoading = false;
    })
     .addCase(createCustomer.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
     .addCase(createCustomer.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      }) 

     //************************ updateCustomer reducer ************************//

    .addCase(updateCustomer.fulfilled, (state, action) => {    
        state.customers = state.customers.map((ele) =>
        ele.id === action.payload.id ? action.payload : ele) 
        state.isLoading = false;
      })
    .addCase(updateCustomer.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
    .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        })   
      ;
      },  
  },
);


export default CustomerSlice.reducer;
export const {selectCustomer} = CustomerSlice.actions;