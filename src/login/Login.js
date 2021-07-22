function Login() {

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

    // make a post request to the auth token endpoint
    // function for that

    const authURL = 'https://osu.ppy.sh/oauth/authorize';
    const authData = {
        'client_id': 8632,
        'response_type': 'code',
        'redirect_uri': 'https://example.com'
    }

    function getToken() {
        let response = 
        //let response = fetch('https://osu.ppy.sh/oauth/authorize?client_id={data.client_id}&response_type={data.response_type}&redirect_uri={data.redirect_uri}');
        
        // let token = fetch();
        // JSON.stringify(token);
        // console.log(token);
    }

    return (
        <div>
            <h1>
                <a href="https://osu.ppy.sh/oauth/authorize?client_id=8632&response_type=code&redirect_uri=https://example.com">Log in with osu! Authentication here!</a>                       
            </h1>
            <div>
                {getToken()}
            </div>
        </div>
    )
}

export default Login;