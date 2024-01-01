import { ipAddress, port, backendURLprefix } from "../myVariables";


const saveTrip = async (isConnected, token, tripIndex) => {
  if (!isConnected) {
    console.log('connot save because not connected');
    return { result: false };
  }
  // save:
  //const url = `http://${ipAddress}:${port}/users/${token}/saveTrip/${tripIndex}`;
  const url = `${backendURLprefix}users/${token}/saveTrip/${tripIndex}`;
  const data = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then(resp => resp.json());
  //console.log(data.savedTrip._id);
  return { result: true, tripId: data.savedTrip._id };
}


const unsaveTrip = async (isConnected, token, tripId) => {
  if (!isConnected) {
    console.log('connot unsave because not connected');
    return { result: false };
  }
  // unsave:
  //const url = `http://${ipAddress}:${port}/users/${token}/unsaveTripById/${tripId}`;
  const url = `${backendURLprefix}users/${token}/unsaveTripById/${tripId}`;
  const data = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then(resp => resp.json());
  //console.log(data.savedTrip._id);
  return { result: true };
}


export { saveTrip, unsaveTrip };
