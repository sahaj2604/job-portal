import { setSearchedQuery } from "@/redux/jobSlice";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const HeroSection = () => {
  const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#f83002] font-medium">
          No. 1 Job hunt website
        </span>
        <h1 className="text-5xl font-bold">
          Search, Apply & <br /> Get your{" "}
          <span className="text-[#6a38c2]">dream job</span>
        </h1>
        <p>
          A job hunt website connects job seekers with employers, offering
          personalized searches, resume tools, and streamlined recruitment
          processes
        </p>
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            className="outline-none border-none w-full"
            placeholder="Enter your dream job"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] text-white px-3 py-2">
            <Search className=" w-5 " />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
