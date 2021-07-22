import { useAuth0 } from '@auth0/auth0-react';
import { Form, Button } from 'react-bootstrap';
// OAuth 2.0 Quick Tutorial 
// is an authorization FRAMEWORK, the authentication of the user happens with OpenID Connect through ID tokens, passed along with the access tokens
// Here is an example:
// User authorizes access for Spotify to use their Facebook information
// Facebook API passes an authorization code back to Spotify
// This is happening on the FRONT END
// Spotify uses this authorization code to request an access token from Facebook
// This is happening on the BACK END 
// This Facebook authorization server is only responsible for authorizing the user and providing the token to Spotify, but doesn't hold any resources
// Spotify now sends the token to Facebook, and in return gets the resources that were authorized by the user in the first place (e.g. avatar, username, etc)  
// For any of this to work, the Spotify developer must register Spotify as an OAuth 2.0 App with Facebook
// When you register your OAuth app, you provide the application name, website, and callback URL (where you get redirected after the authorization happens)
// The API returns credentials to the developer: Client ID (public), Client Secret (used to authenticate your app)
// There are four grant types: authorization code grant (for apps on web servers), implicit grants, password grants, client credentials grant

function Login() {
    const { loginWithRedirect } = useAuth0();
    
    const URL = 'https://osu.ppy.sh/oauth/authorize';
    const authData = {
        'client_id': 8632,
        'client_secret': 'WinqXqj46I2ovYYZzhyBr9xAy0qzWMp1S21WS86h',
        'response_type': 'code',
        'redirect_uri': 'https://example.com',
        'code': 'def50200302dcaf14eb6bfdca688fc08327fa882413ea6f07a02e6cca79aff20c67a6aebb52ab8c6b8ed8e3a01200ff44911b8cb1066cc8da444d6b8ba4a488e80955c56ec939dc1260074f4c955baf7861d9b162973ad2a01a47389207563ccd260d031b110f2b9c45af42deb6e2fc342b4ba36d6ad2b85254916a45e92d26ad2576078817a15c9914eadda3d23e06b140d59afd992a6990c3d2bdcb6f083f615cd2904c3e85c74c667787cb7ed27afd871c3796aed9e8fd19740fc13c010e37775a35c81cb5bcc6759067ab34157be1558681c189d9465e6e692c4275cc4a952fc78e626dd9f8958e5e26d962de0ae664f3479073472458bd11a0dc257d9d45c07a6363505b348ca9fa5b1efb034fc02a920b72bd5b9a998c17637a7b91e6c200fc9c2837697e9def376f4bb1718075910f63a21e219861d42d7e31ebfd7f78a3e8b1d0f87a4d4532d9545c9b7cdffc11754c80c1d3877ec81e43dc7373fc451046182f1',

    }
    async function getToken(url = 'https://osu.ppy.sh/oauth/token', data = authData) {
        // Default options are marked with *
        const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    return (
        <Form onSubmit={loginWithRedirect} inline>
            <Button type="submit" variant="outline-primary">Login</Button>
        </Form>
        // <div>
        //     <h1>
        //         <a href="https://osu.ppy.sh/oauth/authorize?client_id=8632&response_type=code&redirect_uri=https://example.com">Log in with osu! Authentication here!</a>                       
        //     </h1>
        //     <div>
        //         {getToken()}
        //     </div>
        // </div>
    )
}

export default Login;