import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  getMyApplications,
  createApplication,
  editApplication,
  completeApplication,
  acceptApplication,
  deliteApplication,
  updateApplicationStatusEvent,
  addNewApplicationEvent,
  deliteApplicationEvent,
  shouldDeliteApplicationEvent,
} from "store/reducers/application/ActionCreators";
import socket from "socket";

export const useApplication = () => {
  const dispatch = useAppDispatch();
  const {
    myApplications,
    application,
    isLoading,
    myApplicationsIsloading,
    completeApplicationIsLoading,
    deliteApplicationIsLoading,
  } = useAppSelector((state) => state.applicationReducer);

  useEffect(() => {
    socket.on("applicationStatusUpdate", (application) => {
      console.log("Application status updated:", application);
      dispatch(updateApplicationStatusEvent(application));
    });
    socket.on("newApplication", (application) => {
      console.log("newApplication:", application);
      dispatch(addNewApplicationEvent(application));
    });
    socket.on("deliteApplication", (applicationId) => {
      console.log("deliteApplication:", applicationId);
      dispatch(shouldDeliteApplicationEvent(applicationId));
      setTimeout(() => {
        dispatch(deliteApplicationEvent(applicationId));
      }, 1000);
    });
    return () => {
      socket.off("applicationStatusUpdate");
      socket.off("applicationStatusUpdate");
    };
  }, []);

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  return {
    myApplications,
    application,
    isLoading,
    myApplicationsIsloading,
    completeApplicationIsLoading,
    deliteApplicationIsLoading,
    createApplication,
    getMyApplications,
    editApplication,
    completeApplication,
    acceptApplication,
    deliteApplication,
  };
};
