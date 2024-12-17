import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
      });
      const {loading,user}=useSelector(store=>store.auth);
      const navigate=useNavigate();
      const dispatch=useDispatch();
      const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
      };
      const submitHandeler=async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const response=await axios.post(`${USER_API_END_POINT}/login`,input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true,
            })
            if(response.data.success){
              dispatch(setUser(response.data.user))
                navigate('/')
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
        onSubmit={submitHandeler}
        className="rounded-md w-1/2 border border-gray-300 p-4 my-10 "
      >
        <h1 className="font-bold text-xl mb-5">Login</h1>
        <div>
          <Label>email</Label>
          <Input type="email" placeholder="email" name='email' value={input.email} onChange={changeEventHandler}/>
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
        </div>
        {
          loading ? <Button className='w-full my-2'><Loader2 className="mr-2 h-2 w-4 animate-spin" /> please wait...</Button>
          : <Button className='w-full my-2' type='submit'>Login</Button>
        }
        
        <span className="flex justify-center text-sm">Don&apost have an account? <Link className="text-purple-900 underline" to={"/signup"}>signup</Link></span>
      </form>
    </div>
  );
};

export default Login;
