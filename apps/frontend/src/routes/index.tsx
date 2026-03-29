import { createBrowserRouter, redirect } from 'react-router';
import BasicLayout from '../layouts/BasicLayout';
import HomePage from '../pages/home';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <BasicLayout />,
        children: [
            {
                path: '/',
                loader: () => redirect('/home')
            },
            {
                path: '/home',
                element: <HomePage />
            }
        ]
    }
]);
