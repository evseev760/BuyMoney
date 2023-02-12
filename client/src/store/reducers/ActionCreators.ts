import { AppDispatch } from "../";
import axios from "axios";
import { IUser } from "../../models/IUser";
import { userSlice } from "./UserSlice";

import { IReferenceCurrency } from "../../models/IReferenceCurrencies";

// export const fetchUsers = createAsyncThunk(
//   "user/fetchAll",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get<IUser[]>(
//         "https://jsonplaceholder.typicode.com/user2s"
//       );
//       return response.data;
//     } catch (e) {
//       return thunkAPI.rejectWithValue("Не удалось загрузить пользователей");
//     }
//   }
// );
export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(userSlice.actions.usersFetching());
    const response = await axios.get<IUser[]>(
      "https://jsonplaceholder.typicode.com/users"
    );
    dispatch(userSlice.actions.usersFetchingSuccess(response.data));
  } catch (e: any) {
    dispatch(userSlice.actions.usersFetchingError(e.message));
  }
};


