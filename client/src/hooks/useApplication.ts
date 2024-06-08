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
  setLastApplicationsReqest,
} from "store/reducers/application/ActionCreators";
import socket from "socket";
import { userDataWathUpdated } from "store/reducers/auth/ActionCreators";

export const useApplication = () => {
  const dispatch = useAppDispatch();
  const {
    myApplications,
    application,
    isLoading,
    myApplicationsIsloading,
    completeApplicationIsLoading,
    deliteApplicationIsLoading,
    lastApplicationsReqest,
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
    socket.on("userDataWathUpdated", (user) => {
      console.log("userDataWathUpdated:", user);
      dispatch(userDataWathUpdated(user));
    });

    return () => {
      socket.off("applicationStatusUpdate");
      socket.off("applicationStatusUpdate");
    };
  }, []);

  const getMyApplicationsHandle = () => {
    const timestamp = new Date().getTime();
    const needPast = 1 * 60 * 1000;
    if (timestamp - Number(lastApplicationsReqest.timestamp) < needPast) return;
    try {
      dispatch(getMyApplications());
      dispatch(setLastApplicationsReqest({ timestamp }));
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    getMyApplicationsHandle();
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
