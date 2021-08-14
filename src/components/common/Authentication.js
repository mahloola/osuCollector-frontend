import Login from './Login';

const Authentication = ({ user }) => {
    return <Login user={user}/>
    // do something like the following
   // return isAuthenticated ? <Logout /> : <Login />;
}

export default Authentication;
