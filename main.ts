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
  if (req.url?.includes("/get-todo") && req.method === "GET") {
    const url = req.url;
    const todoId = url.split("=").pop();

    if (!todoId) {
      console.error(`Please send todoId`);
      return;
    }

    const todoIdNum = parseInt(todoId);
    console.log("getting todoId", todoId);

    const todo = todos.find((todo) => todo.id === todoIdNum);

    res.writeHead(200, "Get todo success", {
      "Content-Type": "application/json",
      "my-server-name": "todo",
    });
    res.write(
      JSON.stringify({
        data: todo,
        message: "Todo get successfully",
      })
    );
    res.end();
  }

  // delete todo
  if (req.url?.includes(`/delete-todo`) && req.method === "DELETE") {
    const url = req.url;
    const todoId = url.split("=").pop();

    if (!todoId) {
      console.error(`Please send todoId`);
      return;
    }

    const todoIdNum = parseInt(todoId);
    console.log("getting todoId", todoId);

    todos = todos.filter((todo) => todo.id !== todoIdNum);

    res.writeHead(200, "todo deleted successfully", {
      "Content-Type": "application/json",
    });
    res.write(
      JSON.stringify({
        message: "Todo deleted successfully",
      })
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
      })
    );
    res.end();
  }


  // update todo
if (req.url?.includes(`/update-todo`) && req.method === "PUT") {
  let bodyStr = "";

  req.on("data", (chunk) => {
    const chunkStr = chunk.toString();
    bodyStr += chunkStr;
  });

  req.on("end", () => {
    const parsedData = JSON.parse(bodyStr);
    const todoId = parseInt(req.url?.split("=").pop() || "");

    if (!todoId) {
      console.error("Please send valid todoId");
      res.writeHead(400, "Invalid todoId");
      res.write("Invalid todoId");
      res.end();
      return;
    }

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      res.writeHead(404, "Todo not found");
      res.write("Todo not found");
      res.end();
      return;
    }

    // Update the name of the todo
    todos[todoIndex].name = parsedData.name;

    res.writeHead(200, "Todo updated successfully", {
      "Content-Type": "application/json",
    });
    res.write(
      JSON.stringify({
        message: "Todo updated successfully",
      })
    );
    res.end();
  });
}

 
});

server.listen(PORT, () => {
  console.log(`Server started listening on port: ${PORT}`);
});
