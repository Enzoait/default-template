import React from 'react';

// common pages
const Page404 = React.lazy(() => import('pages/CommonPages/Page404'));
const GenericLoginPage = React.lazy(() => import('pages/CommonPages/LoginPage'));
const GenericLogoutPage = React.lazy(() => import('pages/CommonPages/LogoutPage'));
//const LostPassPage = React.lazy(() => import('pages/CommonPages/LostPassPage'));
//const ReinitPassPage = React.lazy(() => import('pages/CommonPages/ReinitPassPage/ReinitPassPage.js'));
//const PeopleRegisterPage = React.lazy(() => import('pages/CommonPages/PeopleRegisterPage/PeopleRegisterPage.js'));
const BackOfficeHomePage = React.lazy(() => import('pages/AdminPages/GenericManagementPage'));

const allRoutes = [

    { path: '/', exact: true, name: 'Admin home', component: BackOfficeHomePage},
    { path: '/view', exact: true, name: 'Admin', component: BackOfficeHomePage},
    { path: `/login`, exact: true, name: 'Authentication', component: GenericLoginPage},
    { path: `/logout`, exact: true, name: 'Authentication', component: GenericLogoutPage},
    //{ path: `/lostPass`, exact: true, name: 'Lost pass', component: LostPassPage },
    //{ path: `/lostPassword/:lockToken`, exact: true, name: 'Pass reinit', component: ReinitPassPage },
    //{ path: `/register/:source`, exact: true, name: 'Register', component: PeopleRegisterPage },
    { path: '/404', exact: true, name: 'Not found', component: Page404},
];

export default allRoutes;




