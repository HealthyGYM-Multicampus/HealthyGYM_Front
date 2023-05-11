import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ToastEditor from "./components/ToastEditor";
import ToastViewer from "./components/ToastViewer";
import Home from "./components/Home";
import Header from "./components/Header";
import BbsList from "./components/bbs/BbsList";
import MyPage from "./components/Mypage/MyPage";

import Login from "./components/auth/Login";
import LoginCallback from "./components/auth/LoginCallback";
import Signup from "./components/auth/Signup";
import PwdEmail from "./components/auth/PwdEmail";
import PwdUpdate from "./components/auth/PwdUpdate";

import Meallist from "./components/Meal/Meallist";
import MealViews from "./components/Meal/MealViews";
import Message from "./components/Message/Message";

import LandingPage from "./components/FindGym/LandingPage";

import HealthEditor from "./components/health/HealthEditor";
import HealthList from "./components/health/HealthList";
import HealthViews from "./components/health/HealthViews";

function App() {
  
  return (
      <>

        <BrowserRouter>
        <Header style={{ height : "55px"}} />

          <main style={{ height : "auto", minHeight: "calc(100% - 115px)" }}>
            <div className="py-4">
              <div style={{ width:"720px", margin:"auto" }}>
                <Routes>
                  <Route path="/" element={<Home />}></Route>

                  {/* 토픽베스트, 바디갤러리 추가해야함 */}
                  <Route path="/community/:bbstag" element={<BbsList />}></Route>

                  <Route path="/mypage/*" element={<MyPage />}></Route>

                  <Route path="/write" element={<ToastEditor />}></Route>

                  <Route path="/view/:bbsseq" exact element={<ToastViewer />}></Route>

                  <Route path="/login" element={<Login />} ></Route>
                  <Route path="/login/callback/:provider" exact element={<LoginCallback />}></Route>
                  <Route path="/signup" element={<Signup />}></Route>
                  <Route path="/password" element={<PwdEmail />}></Route>
                  <Route path="/password/update" element={<PwdUpdate />}></Route>

                  <Route path="/mate/meal/write" element={<Meallist />}></Route>
                  <Route path="/mate/meal" exact element={<MealViews />}></Route>

                  <Route path="/mate/gym" exact element={<LandingPage />}></Route>

                  <Route path="/mate/health" element={<HealthList />}></Route>
                  <Route path="/mate/health/write" element={<HealthEditor />}></Route>
                  <Route path="/mate/health/view/:bbsseq" exact element={<HealthViews />}></Route>
                  
                </Routes>

              </div>
            </div>
          </main>

          
        </BrowserRouter>

        <footer style={{ height:"60px", textAlign:"center", backgroundColor:"#e0e1e2" }}>
          <div>
            <small>Copyright</small>
          </div>
        </footer>

      </>
  );
}

export default App;
