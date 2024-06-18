import { Routes, Route } from 'react-router-dom';
import Settings from '../pages/private/settings/Settings';
import Categories from '../pages/private/categories/Categories';
import Locations from '../pages/private/locations/Locations';
import { EventListByUser } from '../pages/private/events/EventList';
import Roles from '../pages/private/roles/Roles';
import { CreateEvent } from '../pages/private/events/CreateEvent';
import { UpdateEvent } from '../pages/private/events/UpdateEvent';
import { ProtectedRoute } from './ProtectedRoute';
import NotFound from "../pages/public/notFound/NotFound.jsx";

const PrivateRoutes = () => (
    <Routes>
        {/* Rotas para categorias - restrita a admin */}
        <Route path='/categories' element={<ProtectedRoute roleIsAdmin={true}> <Categories /> </ProtectedRoute>} />

        {/* Rotas para locais */}
        <Route path='/locations' element={<ProtectedRoute roleIsVisitor={'visitante'}> <Locations /> </ProtectedRoute>} />

        {/* Rotas para cargos - restrita a admin */}
        <Route path='/roles' element={<ProtectedRoute roleIsAdmin={true}> <Roles /> </ProtectedRoute>} />
        
        {/* Rotas para eventos */}
        <Route path='/my-events' element={<ProtectedRoute roleIsVisitor={'visitante'}> <EventListByUser /> </ProtectedRoute>} />
        <Route path='/create/event' element={<ProtectedRoute roleIsVisitor={'visitante'}> <CreateEvent /> </ProtectedRoute>} />
        <Route path='/update/event/:id' element={<ProtectedRoute roleIsVisitor={'visitante'}> <UpdateEvent /> </ProtectedRoute>} />

        {/* Rotas para usuário */}
        <Route path='/settings' element={<ProtectedRoute> <Settings /> </ProtectedRoute>} />

        <Route path="/*" element={<NotFound />} />
    </Routes>
);

export default PrivateRoutes;
