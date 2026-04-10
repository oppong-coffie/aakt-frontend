import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Register1 from "./auth/Register2";
import Register2 from "./auth/Register2";
import Otp from "./auth/Otp";
import Stage from "./auth/Stage";
import Skills from "./auth/Skills";
import Step from "./auth/Step";
import Confident from "./auth/Confident";
import Feeling from "./auth/Feeling";
import Main from "./pages/bizinfra/Main";
import Dashboard from "./pages/Dashboard";
import MainHomepage from "./pages/home/MainHomepage";
import Homepage from "./pages/home/Homepage";
import PortfolioMain from "./pages/portfolio/Main";
import Finish from "./pages/home/Finish";
import Firstpage from "./pages/bizinfra/Firstpage";
import Skilset from "./pages/bizinfra/Skilset";
import Network from "./pages/bizinfra/Network";
import Capital from "./pages/bizinfra/Capital";
import Intel from "./pages/bizinfra/Intel";
import Reach from "./pages/bizinfra/Reach";
import SkillsetDetail from "./pages/bizinfra/SkillsetDetail";
import Phase from "./pages/bizinfra/Phase";
import Project from "./pages/bizinfra/Project";
import Process from "./pages/bizinfra/Process";
import Block from "./pages/bizinfra/Block";
<<<<<<< HEAD
import SaasDepartment from "./pages/portfolio/Department";
import SaasOperation from "./pages/portfolio/Operation";
import SaasProjectList from "./pages/portfolio/ProjectList";
import SaasProject from "./pages/portfolio/Project";
import SaasPhase from "./pages/portfolio/Phase";
import Saas from "./pages/portfolio/InBusiness";
import InBusinessFolder from "./pages/portfolio/InBusinessFolder";
import PortfolioFirstpage from "./pages/portfolio/Firstpage";

import BusinessName from "./pages/portfolio/questions/Name";
=======
import SaasDepartment from "./pages/portfolio/saas/Department";
import SaasOperation from "./pages/portfolio/saas/Operation";
import SaasProject from "./pages/portfolio/saas/Project";
import SaasPhase from "./pages/portfolio/saas/Phase";
import Saas from "./pages/portfolio/saas/Saas";
import PortfolioFirstpage from "./pages/portfolio/Firstpage";

>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
import What from "./pages/portfolio/questions/What";
import Who from "./pages/portfolio/questions/Who";
import How from "./pages/portfolio/questions/How";
import Culture from "./pages/portfolio/questions/Culture";
<<<<<<< HEAD
import Image from "./pages/portfolio/questions/Image";

import ProcessPage from "./pages/portfolio/Process";
import ProcessByBusiness from "./pages/portfolio/ProcessByBusiness";
import Block2 from "./pages/portfolio/Block";
=======

import ProcessPage from "./pages/portfolio/saas/Process";
import Block2 from "./pages/portfolio/saas/Block";
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9

const App = () => {
  return (
    <MemoryRouter>
      <Routes>
        {/* Public Routes */}
<<<<<<< HEAD
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
=======
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
        <Route path="/register1" element={<Register1 />} />
        <Route path="/register2" element={<Register2 />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/stage" element={<Stage />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/step" element={<Step />} />
        <Route path="/confident" element={<Confident />} />
        <Route path="/feeling" element={<Feeling />} />

        {/* Protected/Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<MainHomepage />}>
            <Route index element={<Homepage />} />
            <Route path="finish" element={<Finish />} />
          </Route>

          <Route path="bizinfra" element={<Main />}>
            <Route index element={<Firstpage />} />
            <Route path="skillset" element={<Skilset />} />
            <Route path="skillset/:id" element={<SkillsetDetail />} />

            <Route path="skillset/:id/project" element={<Project />} />
            <Route path="skillset/:id/project/:phaseId" element={<Phase />} />
            <Route path="skillset/:id/process" element={<Process />} />
            <Route path="skillset/:id/block" element={<Block />} />
            <Route path="network" element={<Network />} />
            <Route path="capital" element={<Capital />} />
            <Route path="intel" element={<Intel />} />
            <Route path="reach" element={<Reach />} />
          </Route>

          <Route path="portfolio" element={<PortfolioMain />}>
            <Route index element={<PortfolioFirstpage />} />
            <Route path="saas" element={<Saas />} />
<<<<<<< HEAD
            <Route path="saas/folder" element={<InBusinessFolder />} />
            <Route path="saas/department" element={<SaasDepartment />} />

            <Route path="questions/name" element={<BusinessName />} />
            <Route path="questions/image" element={<Image />} />
=======
            <Route path="saas/department" element={<SaasDepartment />} />

>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
            <Route path="questions/what" element={<What />} />
            <Route path="questions/who" element={<Who />} />
            <Route path="questions/how" element={<How />} />
            <Route path="questions/culture" element={<Culture />} />

            <Route path="saas/operation" element={<SaasOperation />} />
<<<<<<< HEAD
            <Route path="saas/project" element={<SaasProjectList />} />
            <Route path="saas/project/:projectId" element={<SaasProject />} />
            <Route path="saas/project/:projectId/phase/:phaseId" element={<SaasPhase />} />
            <Route path="saas/process" element={<ProcessPage />} />
            <Route path="saas/business/:businessId/processes" element={<ProcessByBusiness />} />
=======
            <Route path="saas/project" element={<SaasProject />} />
            <Route path="saas/project/:phaseId" element={<SaasPhase />} />
            <Route path="saas/process" element={<ProcessPage />} />
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
            <Route path="saas/block" element={<Block2 />} />
          </Route>

          <Route path="finish" element={<Finish />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;
