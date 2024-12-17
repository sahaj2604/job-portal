import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {loading,user}=useSelector(store=>store.auth)
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };
  const submitHandeler=async (e) => {
    e.preventDefault();
    const formData=new FormData();
    formData.append("fullname",input.fullname)
    formData.append("email",input.email)
    formData.append("phoneNumber",input.phoneNumber)
    formData.append("role",input.role)
    formData.append("password",input.password)
    if(input.file){
        formData.append("file",input.file)
    }
    try {
        dispatch(setLoading(true));
        const response=await axios.post(`${USER_API_END_POINT}/register`,formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            },
            withCredentials:true,
        })
        console.log(response)
        if(response.data.success){
            navigate('/login')
            toast.success(response.data.message)
        }
    } catch (error) {
        console.log('error in signup',error);
        toast.error(error.response.data.message)
    } finally{
        dispatch(setLoading(false));
    }
  }
  useEffect(()=>{
    if(user){
      navigate("/")
    }
  })
  return (
    <div className="flex justify-center items-center max-w-7xl mx-auto">
      <form
        action=""
        className="rounded-md w-1/2 border border-gray-300 p-4 my-10 "
        onSubmit={submitHandeler}
      >
        <h1 className="font-bold text-xl mb-5">Sign Up</h1>
        <div>
          <Label>Full Name</Label>
          <Input type="text" placeholder="fullname" name='fullname' value={input.fullname} onChange={changeEventHandler} />
        </div>
        <div>
          <Label>email</Label>
          <Input type="email" placeholder="email" name='email' value={input.email} onChange={changeEventHandler}/>
        </div>
        <div>
          <Label>Phone No</Label>
          <Input type="number" placeholder="phone" name='phoneNumber' value={input.phoneNumber} onChange={changeEventHandler}/>
        </div>
        <div>
          <Label>Password</Label>
          <Input type="Password" placeholder="Password" name='password' value={input.password} onChange={changeEventHandler}/>
        </div>
        <div className="flex items-center justify-between">
          <RadioGroup
            defaultValue="comfortable"
            className="flex items-center mt-3 gap-4 m-4"
          >
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                name="role"
                value="student"
                className="cursor-pointer"
                checked={input.role==='student'}
                onChange={changeEventHandler}
              />
              <Label htmlFor="r1">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="radio"
                name="role"
                value="recruiter"
                className="cursor-pointer"
                checked={input.role==='recruiter'}
                onChange={changeEventHandler}
              />
              <Label htmlFor="r2">Recruiter</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Label>Profile</Label>
            <Input type="file" accept="image/*" className="cursor-pointer" onChange={changeFileHandler} />
          </div>
        </div>
        {
          loading ? <Button className='w-full my-2'><Loader2 className="mr-2 h-2 w-4 animate-spin" /> please wait...</Button>
          : <Button className='w-full my-2' type='submit'>signup</Button>
        }
        <span className="flex justify-center text-sm">
          Already have an account?{" "}
          <Link className="text-purple-900 underline" to={"/login"}>
            login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
