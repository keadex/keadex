import { createBrowserRouter } from 'react-router-dom'
import Home from '../../views/Home/Home'
import DiagramEditor from '../../views/DiagramEditor/DiagramEditor'
import ROUTES, {
  COMPONENTS_LIBRARY,
  CONTAINERS_LIBRARY,
  EDIT_DIAGRAM,
  HOME,
  HOME_PROJECT,
  PERSONS_LIBRARY,
  PROJECT_SETTINGS,
  SOFTWARE_SYSTEMS_LIBRARY,
} from './routes'
import HomeProject from '../../views/HomeProject/HomeProject'
import Layout from '../../components/Layout/Layout'
import LibraryElement from '../../views/LibraryElement/LibraryElement'
import ProjectSettings from '../../views/ProjectSettings/ProjectSettings'

export default createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES[HOME].path,
        element: <Home />,
      },
      {
        path: ROUTES[HOME_PROJECT].path,
        element: <HomeProject />,
      },
      {
        path: ROUTES[PROJECT_SETTINGS].path,
        element: <ProjectSettings mode="edit" />,
      },
      {
        path: ROUTES[EDIT_DIAGRAM].path,
        element: <DiagramEditor />,
      },
      {
        path: ROUTES[PERSONS_LIBRARY].path,
        element: <LibraryElement c4ElementType="Person" />,
      },
      {
        path: ROUTES[SOFTWARE_SYSTEMS_LIBRARY].path,
        element: <LibraryElement c4ElementType="SoftwareSystem" />,
      },
      {
        path: ROUTES[CONTAINERS_LIBRARY].path,
        element: <LibraryElement c4ElementType="Container" />,
      },
      {
        path: ROUTES[COMPONENTS_LIBRARY].path,
        element: <LibraryElement c4ElementType="Component" />,
      },
    ],
  },
])
