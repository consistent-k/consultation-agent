import { createBrowserRouter } from 'react-router';
import BasicLayout from '../layouts/BasicLayout';
import HomePage from '../pages/home';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <BasicLayout />,
        children: [
            {
                path: '/home',
                index: true,
                element: <HomePage />
            }
        ]
    }
]);
