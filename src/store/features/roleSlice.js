import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";

//************************ interface for role************************//
interface RoleType {
  softwareEngineerSenior : "Software Engineer Senior",
  softwareEngineerRegular :  "Software Engineer Regular",
  requirementsEngineer :  "Requirements Engineer",
  softwareReliabilityEngineer :  "Software Reliability Engineer",
  qualityEngineer :  "Quality Engineer",
  uI_UXDesigner :  "UI/UX Designer",
  technicalArchitect :  "Technical Architect",
  projectManager :  "Project Manager",
  technicalConsultant :  "Technical Consultant",
  agileCoach :  "Agile Coach",
  dataScientist: "Data Scientist",
}

interface Role{
  id: number;
  role_type: RoleType ;  
}

interface RoleAssignmentState {
  roles: Role [];
  isLoading: boolean;
  error: null;

}

const initialState: RoleAssignmentState = {
  roles: [],
  isLoading: false,
  error: false,
};


    
   

   

//************************ get roles AsyncThunk ************************//

export const fetchRoles  = createAsyncThunk(
  "role/fetch",
  async (_,thunkAPI) => {
    const {rejectWithValue} = thunkAPI;
    try {
    const response = await fetch(`http://127.0.0.1:8000/roles/`, {
      method: "GET"
    } ) 
    const data = await response.json();
    return data;
  } catch (error){

    return rejectWithValue(error.message);
  }
  });

  //************************ create role AsyncThunk ************************//

  export const createRole  = createAsyncThunk(
    "role/create",
    async (roleData,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try {
      const response = await fetch(`http://127.0.0.1:8000/roles/`, {
        method: "POST",
        body: JSON.stringify(roleData),
        headers: {
          "Content-Type": "application/json",
      }} ) 
      const data = await response.json();
      return data;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ delete role AsyncThunk ************************//

  export const deleteRole  = createAsyncThunk(
    "role/delete",
    async (id,thunkAPI) => {
      const {rejectWithValue} = thunkAPI;
      try { 
      await fetch(` http://127.0.0.1:8000/roles/${id}/` , {
        method: 'DELETE',
      }) ;
      return id;
    } catch (error){
      return rejectWithValue(error.message);
    }
    });

  //************************ update role AsyncThunk ************************//

  export const updateRole  = createAsyncThunk(
        'role/update',
        async (data , thunkAPI) => {
          const {rejectWithValue} = thunkAPI;
          try {
            const response = await fetch(`http://127.0.0.1:8000/roleAssignments/${data.id}/`, {
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

  //************************ create roleSlice ************************//

export const RoleSlice = createSlice({
  name: "Role",
  initialState: initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder

     //************************ fetchRole reducer ************************//

    .addCase(fetchRoles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.roles= action.payload;
    })
    .addCase(fetchRoles.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
  //************************ deleteRole  reducer ************************//

    .addCase(deleteRole.fulfilled, (state, action) => {
      state.isLoading = false;
     state.roleAssignments= state.roleAssignments.filter ((el) => el.opportunityId !== action.payload);
    })
    .addCase(deleteRole.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteRole.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

   //************************ createRoleAssignment reducer ************************//

    .addCase(createRole.fulfilled, (state, action) => {
      state.roleAssignments.push(action.payload);
      state.isLoading = false;
    })
     .addCase(createRole.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    })
     .addCase(createRole.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      }) 

     //************************ updateRoleAssignment  reducer ************************//

    .addCase(updateRole.fulfilled, (state, action) => {    
        state.roleAssignments = state.roleAssignments.map((ele) =>
        ele.id === action.payload.id ? action.payload : ele) 
        state.isLoading = false;
      })
    .addCase(updateRole.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
    .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        })   
      ;
      },  
  },
);


export default RoleSlice.reducer;
export const {selectRoleAssignments} = RoleSlice.actions;


