import { ipAddress, port } from "../myVariables";


const saveTrip = async (isConnected, token, tripIndex) => {
  if (!isConnected) {
    console.log('connot save because not connected');
    return { result: false };
  }
  // save:
  console.log('must save');
  const url = `http://${ipAddress}:${port}/users/${token}/saveTrip/${tripIndex}`;
  const data = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then(resp => resp.json());
  console.log(data.savedTrip._id);
  return { result: true, tripId: data.savedTrip._id };
}


const unsaveTrip = async (isConnected, token, tripId) => {
  if (!isConnected) {
    console.log('connot save because not connected');
    return { result: false };
  }
  // unsave:
  console.log('must unsave');
  const url = `http://${ipAddress}:${port}/users/${token}/unsaveTripById/${tripId}`;
  const data = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then(resp => resp.json());
  //console.log(data.savedTrip._id);
  //console.log(data);
  return { result: true };
}


// const unsaveTrip = async (isConnected, token, tripIndex) => {
//   if (!isConnected) {
//     console.log('connot save because not connected');
//     return { result: false };
//   }
//   // unsave:
//   console.log('must unsave');
//   const url = `http://${ipAddress}:${port}/users/${token}/unsaveTripByIndex/${tripIndex}`;
//   const data = await fetch(url, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//   }).then(resp => resp.json());
//   //console.log(data.savedTrip._id);
//   console.log(data);
//   return { result: true };
// }


export { saveTrip, unsaveTrip };
