const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

//for now creating a server, without the SSL certfs
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("server started");
    server.start();
  }
);

// adding the service from the package defined in the todo.proto file and then mapping the functions from the service to this server
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream,
});

//methods in grpc take 2 args:
//call => access to the whole call(with the client), i.e info about the tcp conxn etc and
// callback => used to send response back to the client
const todos = [];
function createTodo(call, callback) {
  console.log("call = ", call);
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text,
  };
  todos.push(todoItem);
  callback(null, todoItem);
}
function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodosStream(call, callback) {
  todos.forEach((item) => call.write(item));
  call.end();
}
