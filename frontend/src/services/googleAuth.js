// frontend/src/services/googleAuth.js
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// Replace these with your actual Google OAuth Client IDs from Google Cloud Console
const GOOGLE_WEB_CLIENT_ID =
  "695317988293-tpi6uetkic2hpuchdt78p0h9q11upbsd.apps.googleusercontent.com";
const GOOGLE_IOS_CLIENT_ID =
  "695317988293-tpi6uetkic2hpuchdt78p0h9q11upbsd.apps.googleusercontent.com";
const GOOGLE_ANDROID_CLIENT_ID =
  "695317988293-tpi6uetkic2hpuchdt78p0h9q11upbsd.apps.googleusercontent.com";

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  return {
    request,
    response,
    promptAsync,
  };
};

export { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID };
