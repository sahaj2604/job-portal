import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs()
    const navigate=useNavigate();
    const [input,setInput]=useState("");
    const dispatch=useDispatch();
    useEffect(()=>{
      dispatch(setSearchJobByText(input))
    })
  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex justify-between my-8">
          <Input className="w-fit" placeholder="Filter by name, role" onChange={(e)=>setInput(e.target.value)} />
          <Button onClick={()=>navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
        <AdminJobsTable/>
      </div>
    </div>
  );
};

export default AdminJobs;
