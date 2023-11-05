// EXILIRATE WALLET
// Copyright © Polideck Technologies LLC. All rights Reserved.

// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY 
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { ImmortalDB } from 'immortal-db';
import { ethers } from 'ethers';

//Detect if window is a PWA
function isPWA() { return Boolean((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)|| window.navigator.standalone); }
const db = ImmortalDB.ImmortalDB;
if(isPWA()){
    initWallet().then(() => {maintainJWT();})
} else {
    postMessage({code: 100, msg:"Not Installed as PWA"}, window.location.origin)
}

//Initialize wallet if not found
async function initWallet() {
    let walletStatus = await walletExists();
    if(!walletStatus) {
        let etherWallet = await ethers.Wallet.createRandom();
        let wallet = {
            address: etherWallet.address,
            publicKey: etherWallet.publicKey,
            privateKey: etherWallet.privateKey,
            mnenomic: etherWallet.mnemonic
        }
        await putWallet(wallet);
        etherWallet = null;
    }
    return;
}

//Check if wallet exists
async function walletExists() { if(await db.get("exWallet") == undefined){return false;} else {return true;} }

//Puts wallet into immortalDB
async function putWallet(wallet){await db.set("exWallet", btoa(JSON.stringify(wallet), 'base64'));}
//Gets wallet into immortalDB
async function getWallet(){return JSON.parse(atob(await db.get("exWallet")));}

//Puts wallet into immortalDB
async function putJWT(jwt){db.set("jwt", btoa(jwt, 'base64'));}
//Gets wallet into immortalDB
async function getJWT(){
    let decoded = atob(await db.get("jwt"))
    if(decoded == "ée"){
        return null;
    }
    return decoded;
}
//Parse JWT into JSON Object
function parseJwt(token) {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);}).join(''));
        return JSON.parse(jsonPayload);
    } catch(err){
        console.error("JWT Parse Error: \n" + err);
    }
}
//Checks if wallet should renew jwt
function shouldRenew(jwt){
    const decodedJWT = parseJwt(jwt);
    if ((Date.now() + 60000) >= (decodedJWT["exp"] * 1000)) {
        return true;
    } else {
        return false;
    }
}

//Maintains JWT validity
async function maintainJWT (newJWT) {
    let jwt = newJWT;
    if(jwt == undefined){
        jwt = await getJWT();
    }
    
    if(jwt == undefined || shouldRenew(jwt)){
        let baseURL = "http://127.0.0.1:4000"//"https://auth.exilirate.com"
        console.log("Renewing JWT");
        const wallet = await getWallet();
        const address = wallet["address"];
        fetch(baseURL + "/getNonce?" + new URLSearchParams({
            address: address
        }), {method: "POST"}).then(async (response) => {
            console.log(response);
            response.json().then(async (resJson) => {
                const nonce = resJson.nonce;
                const fullWallet = new ethers.Wallet(wallet["privateKey"]);
                fullWallet.signMessage(nonce).then(async (sig) => {
                    fetch(baseURL + "/login?" + new URLSearchParams({
                        address: address,
                        nonce: nonce,
                        signature: sig
                    }), {method: "POST"}).then(async (response)=> {
                        response.json().then((resJson) => {
                            jwt = resJson.JWT;
                            putJWT(jwt);
                            maintainJWT(jwt);
                        });
                    })
                })
            });
        }).catch(function (err) {
            // There was an error
            console.warn('Uhh oh: ', err);
        });
    }
}

//Begin Ethereum Wallet Transaction Listener
window.addEventListener('message', message => {
    // when transaction event occurs
    console.log(message);
    // verify user and wallet

});