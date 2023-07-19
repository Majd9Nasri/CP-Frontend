import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

//************************ interface for AddressState ************************//

interface Address{
  customer: number;
  country: string;
  city: string;
  street: string;
  zipCode: string;
 
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: boolean;
  selectedAddress?: Address;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  error: false,
  selectedAddress: undefined,
};

//************************ get addresses AsyncThunk ************************//

export const fetchAddress = createAsyncThunk(
  "address/fetch",
  async (_,thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
    const response = await fetch(`http://127.0.0.1:8000/address/`, {
      method: "GET"
    } ) 
    const data = await response.json();
    console.log("moin")
    return data;
  } catch (error){

    return rejectWithValue(error.message);
  }
  });

  //************************ create address AsyncThunk ************************//
 
  export const createAddress = createAsyncThunk(
    "address/create",
    async (addressData,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try {
      const response = await fetch(`http://127.0.0.1:8000/address/`, {
        method: "POST",
        body: JSON.stringify(addressData),
        headers: {
          "Content-Type": "application/json",
      }} ) 
      const data = await response.json();
      return data;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ delete address AsyncThunk ************************//
 
  export const deleteAddress = createAsyncThunk(
    "address/delete",
    async (id,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try { 
      await fetch(` http://127.0.0.1:8000/address/${id}/` , {
        method: 'DELETE',
      }) ;
      return id;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ update address AsyncThunk ************************//
 
  export const updateAddress = createAsyncThunk(
        'address/update',
        async (data  , thunkAPI) => {
          const {rejectWithValue} = thunkAPI;
          try {
            const response = await fetch(`http://127.0.0.1:8000/address/${data.customer}/`, {
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


  //************************ create AddressSlice ************************//

export const AddressSlice = createSlice({
  name: "Address",
  initialState: initialState,
  reducers: {
    selectAddress: (state, action ) => {
      state.selectedAddress = state.addresses.find ((el) => el.customer === action.payload);  
    }
  },
    
  extraReducers: (builder) => {
    builder
   
     //************************ fetchAddress reducer ************************//

    .addCase(fetchAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = action.payload;
    })
    .addCase(fetchAddress.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
  //************************ deleteAddress reducer ************************//

    .addCase(deleteAddress.fulfilled, (state, action) => {
      state.isLoading = false;
     state.addresses = state.addresses.filter ((el) => el.id !== action.payload);
    })
    .addCase(deleteAddress.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

   //************************ createAddress reducer ************************//

    .addCase(createAddress.fulfilled, (state, action) => {
      state.addresses.push(action.payload);
      state.isLoading = false;
    })
     .addCase(createAddress.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
     .addCase(createAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      }) 

     //************************ updateAddress reducer ************************//
    
    .addCase(updateAddress.fulfilled, (state, action) => {    
        state.addresses = state.addresses.map((ele) =>
        ele.id === action.payload.id ? action.payload : ele) 
        state.isLoading = false;
      })
    .addCase(updateAddress.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
    .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        })   
      ;
      },  
  },
);


export default AddressSlice.reducer;
export const {selectAddress} = AddressSlice.actions;



