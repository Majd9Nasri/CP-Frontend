import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

//************************ interface for OpportunityState ************************//

interface Opportunity {
  id: number;
  name: string;
  link: string;
  description: string;
  salesfunnel: string;
  customerRepresentative:  string; 
  date: Date;

  Customer_id: number;
}

interface OpportunityState {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: boolean;
  selectedOpportunity?: Opportunity;
}

const initialState: OpportunityState = {
  opportunities: [],
  isLoading: false,
  error: false,
  selectedOpportunity: undefined,
};

//************************ get Opportunities AsyncThunk ************************//

export const fetchOpportunity = createAsyncThunk(
  "opportunity/fetch",
  async (_,thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
    const response = await fetch(`http://127.0.0.1:8000/opportunities/`, {
      method: "GET"
    } ) 
    const data = await response.json();
    return data;
  } catch (error){

    return rejectWithValue(error.message);
  }
  });

  //************************ create Opportunity AsyncThunk ************************//

  export const createOpportunity = createAsyncThunk(
    "opportunity/create",
    async (opportunityData,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try {
      const response = await fetch(`http://127.0.0.1:8000/opportunities/`, {
        method: "POST",
        body: JSON.stringify(opportunityData),
        headers: {
          "Content-Type": "application/json",
      }} ) 
      const data = await response.json();
      return data;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ delete Opportunity AsyncThunk ************************//

  export const deleteOpportunity = createAsyncThunk(
    "opportunity/delete",
    async (id,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try { 
      await fetch(` http://127.0.0.1:8000/opportunities/${id}/` , {
        method: 'DELETE',
      }) ;
      return id;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ update Opportunity AsyncThunk ************************//

  export const updateOpportunity = createAsyncThunk(
        'opportunity/update',
        async (data , thunkAPI) => {
          const {rejectWithValue} = thunkAPI;
          try {
            const response = await fetch(`http://127.0.0.1:8000/opportunities/${data.id}/`, {
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


  //************************ create OpportunitySlice ************************//

export const OpportunitySlice = createSlice({
  name: "Opportunity",
  initialState: initialState,
  reducers: {
    selectOpportunity: (state, action ) => {
      state.selectedOpportunity = state.opportunities.find ((element) => element.id === action.payload);  
    }
  },
    
  extraReducers: (builder) => {
    builder

     //************************ fetchOpportunity reducer ************************//

    .addCase(fetchOpportunity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.opportunities = action.payload;
    })
    .addCase(fetchOpportunity.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchOpportunity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
  //************************ deleteOpportunity reducer ************************//

    .addCase(deleteOpportunity.fulfilled, (state, action) => {
      state.isLoading = false;
     state.opportunities = state.opportunities.filter ((el) => el.id !== action.payload);
    })
    .addCase(deleteOpportunity.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteOpportunity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

   //************************ createOpportunity reducer ************************//

    .addCase(createOpportunity.fulfilled, (state, action) => {
      state.opportunities.push(action.payload);
      state.isLoading = false;
    })
     .addCase(createOpportunity.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
     .addCase(createOpportunity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      }) 

     //************************ updateOpportunity reducer ************************//

    .addCase(updateOpportunity.fulfilled, (state, action) => {    
        state.opportunities = state.opportunities.map((ele) =>
        ele.id === action.payload.id ? action.payload : ele) 
        state.isLoading = false;
      })
    .addCase(updateOpportunity.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
    .addCase(updateOpportunity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        })   
      ;
      },  
  },
);


export default OpportunitySlice.reducer;
export const {selectOpportunity} = OpportunitySlice.actions;



