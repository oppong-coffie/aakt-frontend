import { BrowserRouter, Routes, Route, Navigate, Outlet, useOutletContext } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Onboard from "./auth/Onboard";
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
import Phase from "./pages/bizinfra/Phase";
import Project from "./pages/bizinfra/Project";
import Projects from "./pages/bizinfra/Projects";
import Process from "./pages/bizinfra/Tasks";
import Block from "./pages/bizinfra/Document";

import SaasDepartment from "./pages/portfolio/Department";
import SaasOperation from "./pages/portfolio/Operation";
import SaasProjectList from "./pages/portfolio/ProjectList";
import SaasProject from "./pages/portfolio/Project";
import SaasPhase from "./pages/portfolio/Phase";
import Saas from "./pages/portfolio/InBusiness";
import InBusinessFolder from "./pages/portfolio/InBusinessFolder";
import BusinessFolder from "./pages/portfolio/BusinessFolder";
import PortfolioFirstpage from "./pages/portfolio/Firstpage";

import BusinessName from "./pages/portfolio/questions/Name";
import What from "./pages/portfolio/questions/What";
import Who from "./pages/portfolio/questions/Who";
import How from "./pages/portfolio/questions/How";
import Culture from "./pages/portfolio/questions/Culture";
import Image from "./pages/portfolio/questions/Image";

import ProcessPage from "./pages/portfolio/ProjectTask";
import BusinessTasks from "./pages/portfolio/BusinessTasks";
import ShowBusinessTask from "./pages/portfolio/ShowBusinessTask";
import ShowBusinessDoc from "./pages/portfolio/ShowBusinessDoc";
import Block2 from "./pages/portfolio/Block";
import BusinessDocs from "./pages/portfolio/BusinessDocs";

import IntegrationsIndex from "./pages/integrations/Index";
import IntegrationsYouTube from "./pages/integrations/YouTube";
import IntegrationsDocuments from "./pages/integrations/Documents";
import IntegrationsSpreadsheet from "./pages/integrations/Spreadsheet";
import IntegrationsWhiteboard from "./pages/integrations/Whiteboard";
import IntegrationsFiles from "./pages/integrations/Files";
import IntegrationsSlides from "./pages/integrations/Slides";
import AgentWorkspace from "./pages/agent/AgentWorkspace";
import Privacy from "./auth/Privacy";
import Terms from "./auth/Terms";

const IntegrationsLayout = () => {
  const context = useOutletContext();
  return <Outlet context={context} />;
};

const App = () => {
  return (
    <BrowserRouter>

      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* <Route path="/register1" element={<Register1 />} /> */}
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/stage" element={<Stage />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/step" element={<Step />} />
        <Route path="/confident" element={<Confident />} />
        <Route path="/feeling" element={<Feeling />} />

        {/* Protected/Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Home Routes */}
          <Route path="home" element={<MainHomepage />}>
            <Route index element={<Homepage />} />
            <Route path="finish" element={<Finish />} />
          </Route>
          {/* BizInfra Routes */}
          <Route path="bizinfra" element={<Main />}>
            <Route index element={<Firstpage />} />
            <Route path="skillset" element={<Skilset />} />
            <Route path="skillset/:id/projects" element={<Projects />} />
            <Route path="skillset/:id/projects/:projectId" element={<Project />} />
            <Route path="skillset/:id/projects/:projectId/:phaseId" element={<Phase />} />
            <Route path="skillset/:id/project" element={<Project />} />
            <Route path="skillset/:id/project/:phaseId" element={<Phase />} />
            <Route path="skillset/:id/process" element={<Process />} />
            <Route path="skillset/:id/block" element={<Block />} />
            <Route path="network" element={<Network />} />
            <Route path="capital" element={<Capital />} />
            <Route path="intel" element={<Intel />} />
            <Route path="reach" element={<Reach />} />
          </Route>
          {/* Portfolio Routes */}
          <Route path="portfolio" element={<PortfolioMain />}>
            <Route index element={<PortfolioFirstpage />} />
            <Route path="saas" element={<Saas />} />
            <Route path="saas/folder" element={<InBusinessFolder />} />
            <Route path="saas/folder/:folderId" element={<BusinessFolder />} />
            <Route path="saas/department" element={<SaasDepartment />} />

            <Route path="questions/name" element={<BusinessName />} />
            <Route path="questions/image" element={<Image />} />
            <Route path="questions/what" element={<What />} />
            <Route path="questions/who" element={<Who />} />
            <Route path="questions/how" element={<How />} />
            <Route path="questions/culture" element={<Culture />} />

            <Route path="saas/operation" element={<SaasOperation />} />
            <Route path="saas/project" element={<SaasProjectList />} />
            <Route path="saas/project/:projectId" element={<SaasProject />} />
            <Route path="saas/project/:projectId/phase/:phaseId" element={<SaasPhase />} />
            <Route path="saas/process" element={<ProcessPage />} />
            <Route path="saas/block" element={<Block2 />} />
            <Route path="saas/businesstasks/:businessId" element={<BusinessTasks />} />
            <Route path="saas/showbusinesstask/:taskId" element={<ShowBusinessTask />} />
            <Route path="saas/showbusinessdoc/:docId" element={<ShowBusinessDoc />} />
            <Route path="saas/businessdocs/:businessId" element={<BusinessDocs />} />


          </Route>
          {/* Integrations Routes */}
          <Route path="integrations" element={<IntegrationsLayout />}>
            <Route index element={<IntegrationsIndex />} />
            <Route path="youtube" element={<IntegrationsYouTube />} />
            <Route path="documents" element={<IntegrationsDocuments />} />
            <Route path="spreadsheet" element={<IntegrationsSpreadsheet />} />
            <Route path="whiteboard" element={<IntegrationsWhiteboard />} />
            <Route path="files" element={<IntegrationsFiles />} />
            <Route path="slides" element={<IntegrationsSlides />} />
          </Route>
          <Route path="ai" element={<AgentWorkspace />} />

          <Route path="finish" element={<Finish />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
