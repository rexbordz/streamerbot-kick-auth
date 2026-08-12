// Settings configuration
const urlParams = new URLSearchParams(window.location.search);
const sbAddress = urlParams.get("address") || "127.0.0.1";
const sbPort = urlParams.get("port") || "8080";
const sbPassword = urlParams.get("password"); 

// Global variables
let streamerbotConnected = false;
let actionFired = false;
const actionId = "1af6350d-fef2-47a4-b596-1342a0e8135a";
const code = urlParams.get("code");
const oauthError = urlParams.get("error");


// =============================
// Streamer.bot Setup
// =============================
const sbClient = new StreamerbotClient({
  host: sbAddress,
  port: sbPort,
  password: sbPassword,

  onConnect: (data) => {
    if (!streamerbotConnected){
      streamerbotConnected = true;
      console.log(`✅ Streamer.bot connected to ${sbAddress}:${sbPort}`)
      console.debug(data);   
    }

    if (!actionFired) {
      actionFired = true;
      handleKickRedirect();
    }
  },

  onDisconnect: () => {
    if (streamerbotConnected) {
      streamerbotConnected = false;
      console.warn("❌ Streamer.bot disconnected");
    }  
  }
});

sbClient.on('General.Custom', (data) => {
  const payload = data?.data;
  if (!payload || payload.source !== "kickReauth") return;
  showState(payload.success ? 'success' : 'error', payload.message);
});

// =============================
// MAIN FUNCTIONS
// =============================

function showState(state, message) {
  document.getElementById('state-pending').hidden = state !== 'pending';
  document.getElementById('state-success').hidden = state !== 'success';
  document.getElementById('state-error').hidden = state !== 'error';
  if (state === 'error' && message) {
    document.getElementById('error-message').textContent = message;
  }
}

function handleKickRedirect() {
  if (oauthError) {
    showState('error', `Kick returned an error: ${oauthError}`);
    return;
  }
  if (!code) return;
  showState('pending');

  const args = 
    {
      code: code,
      triggerSource: "KickReauthPage",
    }
  sbClient.doAction(actionId, args);
}

// showState('error');
// showState('success');







