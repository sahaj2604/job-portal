import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
const Navbar = () => {
  let { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error in logout", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="">
      <div className="flex justify-between items-center max-w-6xl h-16 mx-auto">
        <div>
          <Link to={"/"}>
            <h1 className="text-2xl font-bold">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center  gap-5">
            {user && user?.role === "recruiter" ? (
              <>
                <Link to={"/admin/companies"}>
                  <li>Companies</li>
                </Link>
                <Link to={"/admin/jobs"}>
                  <li>Jobs</li>
                </Link>
              </>
            ) : (
              <>
                <Link to={"/"}>
                  <li>Home</li>
                </Link>
                <Link to={"/jobs"}>
                  <li>Jobs</li>
                </Link>
                <Link to={"/browse"}>
                  <li>Browse</li>
                </Link>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center">
              <Link to={"/login"}>
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to={"/signup"}>
                <Button
                  variant="outline"
                  className="bg-[#6A38C2] text-white hover:bg-[#4f2991] hover:text-white"
                >
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user.profile.profilePhoto
                        ? `${user?.profile?.profilePhoto}`
                        : "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-4 space-y-1">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={`${user?.profile?.profilePhoto}`}
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}{" "}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-600">
                  {user && user.role === "student" && (
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <Button variant="link">
                      <User2 />
                        {" "}
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <Button onClick={logoutHandler} variant="link">
                    <LogOut />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
