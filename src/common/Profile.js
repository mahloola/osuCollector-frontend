import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { user }  = useAuth0();

    return (
        <div>
            hiii
            {JSON.stringify(user, null, 2)}
        </div>
    )
}

export default Profile;
