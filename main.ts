import http from "http";

const PORT = 4000;

type TTodo = {
  id: number;
  name: string;
};

let todos: TTodo[] = [
  {
    id: 1,
    name: "ram",
  },
  {
    id: 2,
    name: "shyam",
  },
  {
    id: 3,
    name: "hari",
  },
];

const server = http.createServer((req, res) => {
  console.log("request received", req.url);

  // create todo
  if (req.url === "/create-todo" && req.method === "POST") {
    let bodyStr = "";

    req.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      bodyStr += chunkStr;
    });

    req.on("end", () => {
      const parsedData = JSON.parse(bodyStr);
      console.log("All data received for todo create", parsedData);

      const todoId = todos.length + 1;

      todos.push({
        id: todoId,
        name: parsedData.name,
      });

      res.writeHead(200, "created todo successfully");
      res.write("Todo created");
      res.end();
    });
  }

  // get todo
  // TODO: fix me later. use a url parser
  if (req.url?.includes("/get-todo") && req.method === "GET") {
    const url = req.url; // /get-todo?id=4

    // ['/get-todo', "id=4"]
    // ["id=4"]
    // ['id', '4']

    const todoId = url.split("=").pop();

    if (!todoId) {
      console.error(`Please send todoId`);
      // TODO: send the error to the client
      return;
    }

    const todoIdNum = parseInt(todoId);
    console.log("getting todoId", todoId);

    const todo = todos.find((todo) => {
      if (todo.id === todoIdNum) return true;

      return false;
    });

    console.log(`todo found by id: ${todoId}`, todo);

    res.writeHead(200, "Get todo success", {
      "Content-Type": "application/json",
      "my-server-name": "todo",
    });

    // !FIXME: there is bug when todo is null / undefined
    res.write(
      JSON.stringify({
        data: !todo ? null : todo,
        message: "todo get successfully",
      }),
    );

    res.end();
  }

  // delete todo
  if (req.url?.includes(`/delete-todo`) && req.method === "DELETE") {
    const url = req.url; // /delete-todo?id=4
    const todoId = url.split("=").pop();

    if (!todoId) {
      console.error(`Please send todoId`);
      // TODO: send the error to the client
      return;
    }

    const todoIdNum = parseInt(todoId);
    console.log("getting todoId", todoId);

    const filteredArray = todos.filter((todo) => {
      if (todo.id === todoIdNum) {
        return false;
      }
      return true;
    });

    todos = filteredArray;

    // send response to the client
    res.writeHead(200, "todo deleted successfully", {
      "Content-Type": "application/json",
    });
    res.write(
      JSON.stringify({
        message: "Todo deleted successfully",
      }),
    );
    res.end();
  }

  // get all todos
  if (req.url === "/get-all-todo" && req.method === "GET") {
    res.writeHead(200, "Get all todos success", {
      "Content-Type": "application/json",
    });
    res.write(
      JSON.stringify({
        data: todos,
        message: "All todos fetched successfully",
      }),
    );
    console.log(todos);
    res.end();
  }

  // update todo
  if (req.url === "/update-todo" && req.method === "PUT") {
    const updateTodo = (id: number, newName: string) => {
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        todos[todoIndex].name = newName;
        return todos[todoIndex];
      }
    };
    const updatedUser = updateTodo(2, "jhone");
    console.log("update data:", updatedUser);
    res.write(
      JSON.stringify({
        message: "todo update successfully",
      }),
    );
    res.end();
  }


});

server.listen(PORT, () => {
  console.log(`Server started listening on port: ${PORT}`);
});
