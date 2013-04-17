define(['oauth'], function (oauth) {
    
var OAuth=oauth.OAuth;

var oa= new OAuth("http://term.ie/oauth/example/request_token.php",
                  "http://term.ie/oauth/example/access_token.php",
                  "key",
                  "secret",
                  "1.0",
                  null,
                  "HMAC-SHA1")

oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
  if(error) console.log('error :' + error)
  else { 
    console.log('oauth_token :' + oauth_token)
    console.log('oauth_token_secret :' + oauth_token_secret)
    console.log('requestoken results :' + console.log(results))
    console.log("Requesting access token")
    oa.getOAuthAccessToken(oauth_token, oauth_token_secret, function(error, oauth_access_token, oauth_access_token_secret, results2) {
      console.log('oauth_access_token :' + oauth_access_token)
      console.log('oauth_token_secret :' + oauth_access_token_secret)
      console.log('accesstoken results :' + console.log(results2))
      console.log("Requesting access token")
      var data= "";
      oa.getProtectedResource("http://term.ie/oauth/example/echo_api.php?foo=bar&too=roo", "GET", oauth_access_token, oauth_access_token_secret,  function (error, data, response) {
          console.log(data);
      });
    });
  }
})
});