import { useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const {singleJob}=useSelector(store=>store.job);
  const {user}=useSelector(store=>store.auth)
  const dispatch = useDispatch();
  const isInitiallyApplied = singleJob?.applications?.some(application=>application.applicant === user?._id) || false;
  const [isApplied,setIsApplied]=useState(isInitiallyApplied);
  const applyJobHandeler=async () => {
    try {
      const res=await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`,{withCredentials:true})
      if(res.data.success){
        setIsApplied(true)
        const updatedSingleJob={...singleJob,application:[...singleJob.applications,{applicant:user?._id}]}
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    const fetchSingleJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(application=>application.applicant===user?._id))
        }
      } catch (error) {
        console.log("error in getAllJobs", error);
      }
    };
    fetchSingleJobs();
  }, [jobId,dispatch,user?._id]);
  return (
    <div className="mx-auto my-10 max-w-7xl">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
            {singleJob?.position} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
            {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
            {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandeler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already applied" : "Apply"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        {singleJob?.description}
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob?.location}</span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
          {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob?.experienceLevel} Years</span>
        </h1>
        <h1 className="font-bold my-1">
          Salary: <span className="pl-4 font-normal text-gray-800">{singleJob?.salary} LPA</span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob?.applications?.length}</span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob?.createdAt.split("T")[0]}</span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
