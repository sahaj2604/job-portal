import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const {user}=useSelector(store=>store.auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user?.role==='recruiter'){
      navigate('/admin/companies')
    }
  },[])
  return (
    <div>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs/>
    </div>
  )
}

export default Home
