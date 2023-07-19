
import { OpportunitySlice  } from "./features/opportunitySlice";
import { CustomerSlice  } from "./features/customerSlice";
import { AddressSlice} from "./features/addressSlice";
import { CustomerDetailsSlice} from "./features/customerDetailsSlice";
import { RoleSlice} from "./features/roleSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";



export const store = configureStore({
  reducer: {
    opportunity: OpportunitySlice.reducer,
    customer: CustomerSlice.reducer,
    address: AddressSlice.reducer,
    role: RoleSlice.reducer,
    customerDetails: CustomerDetailsSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
