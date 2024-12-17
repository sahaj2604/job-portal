import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
    const navigate=useNavigate();
    const [input,setInput]=useState("");
    const dispatch=useDispatch();
    useEffect(()=>{
      dispatch(setSearchCompanyByText(input))
    })
  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex justify-between my-8">
          <Input className="w-fit" placeholder="Filter by name" onChange={(e)=>setInput(e.target.value)} />
          <Button onClick={()=>navigate("/admin/companies/create")}>New Comapany</Button>
        </div>
        <CompaniesTable/>
      </div>
    </div>
  );
};

export default Companies;
