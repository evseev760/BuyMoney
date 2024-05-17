import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  getMyApplications,
  createApplication,
  editApplication,
} from "store/reducers/application/ActionCreators";

export const useApplication = () => {
  const dispatch = useAppDispatch();
  const { myApplications, application, isLoading, myApplicationsIsloading } =
    useAppSelector((state) => state.applicationReducer);

  useEffect(() => {
    dispatch(getMyApplications());
  }, []);

  return {
    myApplications,
    application,
    isLoading,
    myApplicationsIsloading,
    createApplication,
    getMyApplications,
    editApplication,
  };
};
