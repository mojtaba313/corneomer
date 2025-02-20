import mongoose from "mongoose";

export const connectToDB = () => {
  return "heelo";
};

// export const connectToDB = () => {
//   try {
//     if (!mongoose.connections[0].readyState) {
//       // mongoose.connect(process.env.MONGODB_URI);
//       mongoose.connect(
//         "mongodb+srv://<mojtaba>:<ZHKLGpmt6W!uY>@cluster.mongodb.net/corneomer?retryWrites=true&w=majority"
//       );
//       console.log("Connected To DB");
//     }
//   } catch (err) {
//     console.error("Failed to Connect DB => ", err);
//   }
// };
