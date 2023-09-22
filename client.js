const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const text = process.argv[2];

const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

client.createTodo(
  {
    id: -1,
    text,
  },
  (err, res) => {
    console.log("Created Todo", JSON.stringify(res));
  }
);

// client.readTodos(null, (err, res) => {
//   // console.log("Read all TODOs from server", JSON.stringify(res));
//   res.items.forEach((item) => {
//     console.log(item.text);
//   });
// });

const call = client.readTodosStream();
call.on("data", (item) => {
  console.log("Response from server", JSON.stringify(item));
});

call.on("end", (e) => {
  console.log("server done!");
});
